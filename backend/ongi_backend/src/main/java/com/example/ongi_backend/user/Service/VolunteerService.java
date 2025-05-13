package com.example.ongi_backend.user.Service;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;
import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.aws.AwsSqsNotificationSender;
import com.example.ongi_backend.global.entity.CurrentMatching;
import com.example.ongi_backend.global.entity.VolunteerInfo;
import com.example.ongi_backend.global.entity.DistrictType;
import com.example.ongi_backend.global.entity.VolunteerType;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.redis.service.UnMatchingService;
import com.example.ongi_backend.user.Dto.RequestMatching;
import com.example.ongi_backend.user.Dto.RequestRecommendMatching;
import com.example.ongi_backend.user.Dto.ResponseAvailableVolunteerDetail;
import com.example.ongi_backend.user.Dto.ResponseMatchedUserInfo;
import com.example.ongi_backend.user.Dto.RecommendVolunteer;
import com.example.ongi_backend.user.Dto.ResponseVolunteerMainPage;
import com.example.ongi_backend.global.entity.Schedules;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.BaseUser;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.dto.RequestRecommend;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.volunteerActivity.service.VolunteerActivityService;
import com.example.ongi_backend.weeklyAvailableTime.entity.WeeklyAvailableTime;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VolunteerService {
	private final VolunteerRepository volunteerRepository;
	private final VolunteerActivityService volunteerActivityService;
	private final UnMatchingService unMatchingService;
	private final AwsSqsNotificationSender awsSqsNotificationSender;
	private final UserService userService;

	@Transactional
	public void updateSchedule(List<Schedules> schedules, int category, String username) {
		Volunteer volunteer = (Volunteer)userService.findUserByUserName(username, "volunteer");

		List<WeeklyAvailableTime> collect = schedules.stream().map(schedule -> WeeklyAvailableTime.builder()
			.dayOfWeek(schedule.getDayOfWeek())
			.availableStartTime(schedule.getTime())
			.availableEndTime(schedule.getTime().plusHours(3))
			.volunteer(volunteer)
			.build()).collect(Collectors.toList());
		volunteer.updateCategory(category);
		volunteer.addWeeklyAvailableTime(collect);
		scanUnMatching(collect, volunteer);
	}

	@Transactional
	public void scanUnMatching(List<WeeklyAvailableTime> weeklyAvailableTimes, Volunteer volunteer) {
		unMatchingService.findAllUnMatching().forEach(unMatching -> {
			if(unMatching == null) return ;
			weeklyAvailableTimes.forEach(weeklyAvailableTime -> {
				if (unMatching.getStartTime().getDayOfWeek().equals(weeklyAvailableTime.getDayOfWeek())
					&& unMatching.getStartTime().toLocalTime().equals(weeklyAvailableTime.getAvailableStartTime())
					&& (VolunteerType.getCategory(unMatching.getVolunteerType()) & weeklyAvailableTime.getVolunteer()
					.getVolunteerCategory()) != 0
					&& unMatching.getAddress()
					.getDistrict()
					.equals(weeklyAvailableTime.getVolunteer().getAddress().getDistrict())) {
					volunteerActivityService.matchingIfNotAlreadyMatched(unMatching, volunteer);
				}
			});
		});
	}

	@Transactional
	public void deleteMatching(Long id, String username) {
		VolunteerActivity findVolunteerActivity = volunteerActivityService.findById(id);

		Volunteer volunteer = (Volunteer)userService.findUserByUserName(username, "volunteer");
		if (findVolunteerActivity.getVolunteer() == null || !findVolunteerActivity.getVolunteer().equals(volunteer)) {
			throw new CustomException(ACCESS_DENIED_ERROR);
		}
		if (findVolunteerActivity.getStatus().equals(PROGRESS)) {
			Elderly elderly = findVolunteerActivity.getElderly();
			awsSqsNotificationSender.cancelNotification(
				elderly.getFcmToken(),
				volunteer.getName(),
				elderly.getId(),
				"elderly"
			);
			findVolunteerActivity.updateVolunteer(null);
			findVolunteerActivity.updateStatus(MATCHING);
			if (Duration.between(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime(), findVolunteerActivity.getStartTime()).getSeconds() < 0L) {
				awsSqsNotificationSender.expireNotification(
					elderly.getFcmToken(),
					elderly.getId()
				);
				volunteerActivityService.deleteActivity(id);
				return;
			}

			unMatchingService.saveUnMatching(
				findVolunteerActivity.getId(),
				findVolunteerActivity.getElderly().getId(),
				findVolunteerActivity
			);
		} else {
			throw new CustomException(UNAVAILABLE_CANCLE_VOLUNTEER_ACTIVITY_ERROR);
		}
	}

	public List<RecommendVolunteer> findAvailableVolunteer(RequestRecommend request) {
		DayOfWeek dayOfWeek = request.getStartTime().getDayOfWeek();
		LocalTime startTime = request.getStartTime().toLocalTime();
		LocalDate date = request.getStartTime().toLocalDate();
		Integer category = VolunteerType.getCategory(request.getVolunteerType());

		List<Long> list = volunteerRepository.findAllByWeeklyAvailableTime(dayOfWeek, startTime, date, category,
			request.getAddress().getDistrict()).stream().map(BaseUser::getId).toList();
		// TODO : fastAPI와 연결

		return list.stream().map(
			id ->
			{
				Volunteer volunteer = volunteerRepository.findById(id).orElseThrow(
					() -> new CustomException(NOT_FOUND_USER_ERROR)
				);
				return RecommendVolunteer.of(
					volunteer.getName(),
					volunteer.getVolunteerActivities().size() * 3,
					volunteer.getId(),
					volunteer.getProfileImage(),
					volunteer.getBio()
				);
			}
		).toList();
	}

	@Transactional
	public ResponseMatchedUserInfo matchingIfDayOfWeekTimeMatched(RequestMatching request, Elderly elderly) {
		VolunteerActivity volunteerActivity = volunteerActivityService.findById(request.getMatchingId());
		if(volunteerActivity.getVolunteer() != null){
			throw new CustomException(ALREADY_MATCHING_ERROR);
		}
		if(volunteerActivity.getElderly() != elderly){
			throw new CustomException(ACCESS_DENIED_ERROR);
		}
		DayOfWeek dayOfWeek = volunteerActivity.getStartTime().getDayOfWeek();
		LocalTime startTime = volunteerActivity.getStartTime().toLocalTime();
		LocalDate date = volunteerActivity.getStartTime().toLocalDate();
		Integer category = volunteerActivity.getType().getCategory();
		DistrictType district = volunteerActivity.getAddress().getDistrict();

		return volunteerRepository.findByWeeklyAvailableTime(dayOfWeek, startTime, date, category, district)
			.map(volunteer -> {
				// 매칭 알림
				awsSqsNotificationSender.matchingNotification(
					volunteer.getFcmToken(), elderly.getName(), volunteer.getId(), "volunteer"
				);
				awsSqsNotificationSender.matchingNotification(
					elderly.getFcmToken(), volunteer.getName(), elderly.getId(), "elderly"
				);

				// 일정 예약 메시지
				awsSqsNotificationSender.setSchedulingMessageWithTaskScheduler(volunteerActivity, elderly, volunteer,
					"volunteer");
				awsSqsNotificationSender.setSchedulingMessageWithTaskScheduler(volunteerActivity, elderly, volunteer,
					"elderly");

				// 상태 업데이트
				volunteerActivity.updateStatus(PROGRESS);
				volunteerActivity.updateVolunteer(volunteer);

				// 응답 객체 생성
				return ResponseMatchedUserInfo.of(
					volunteer.getName(),
					volunteer.getPhone(),
					volunteer.getProfileImage(),
					volunteer.getVolunteerActivities().size() * 3
				);
			})
			.orElseGet(() -> {
				// 매칭 실패 처리
				awsSqsNotificationSender.unMatchingNotification(elderly.getFcmToken(), elderly.getId());
				unMatchingService.saveUnMatching(
					volunteerActivity.getId(),
					elderly.getId(),
					volunteerActivity
				);
				return null; // 또는 throw new NoMatchingVolunteerException();
			});
	}

	@Transactional
	public ResponseMatchedUserInfo recommendMatching(RequestRecommendMatching request, Elderly elderly) {
		VolunteerActivity volunteerActivity = volunteerActivityService.findById(request.getMatchingId());
		if(volunteerActivity.getVolunteer() != null){
			throw new CustomException(ALREADY_MATCHING_ERROR);
		}
		if(volunteerActivity.getElderly() != elderly){
			throw new CustomException(ACCESS_DENIED_ERROR);
		}
		Volunteer volunteer = volunteerRepository.findById(request.getVolunteerId()).orElseThrow(
			() -> new CustomException(NOT_FOUND_USER_ERROR)
		);


		volunteerActivity.updateStatus(PROGRESS);
		volunteerActivity.updateVolunteer(volunteer);

		//매칭 알림
		awsSqsNotificationSender.matchingNotification(
			volunteer.getFcmToken(), elderly.getName(), volunteer.getId(), "volunteer"
		);
		awsSqsNotificationSender.matchingNotification(
			elderly.getFcmToken(), volunteer.getName(), elderly.getId(), "elderly"
		);

		// 일정 예약 알림
		awsSqsNotificationSender.setSchedulingMessageWithTaskScheduler(volunteerActivity, elderly, volunteer,
			"volunteer");
		awsSqsNotificationSender.setSchedulingMessageWithTaskScheduler(volunteerActivity, elderly, volunteer,
			"elderly");

		// 응답 객체 생성
		return ResponseMatchedUserInfo.of(
			volunteer.getName(),
			volunteer.getPhone(),
			volunteer.getProfileImage(),
			volunteer.getVolunteerActivities().size() * 3
		);
	}

	public ResponseVolunteerMainPage getVolunteerMainPage(String name) {
		Volunteer userByUserName = (Volunteer)userService.findUserByUserName(name, "volunteer");
		// 오늘 날짜
		VolunteerActivity currentVa = userByUserName.getVolunteerActivities().stream().filter(
			volunteerActivity -> ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate().equals(volunteerActivity.getStartTime().toLocalDate())
		).findAny().orElse(null);
		return ResponseVolunteerMainPage.of(VolunteerInfo.of(userByUserName),
			userByUserName.getWeeklyAvailableTimes().stream().map(
				availTime -> Schedules.of(availTime.getDayOfWeek(), availTime.getAvailableStartTime())
			).collect(Collectors.toList()), currentVa == null ? null : CurrentMatching.VolunteerOf(
				currentVa
			));
	}

	public ResponseAvailableVolunteerDetail getAvailableVolunteerDetail(Long volunteerId) {
		Volunteer volunteer = volunteerRepository.findById(volunteerId).orElseThrow(
			() -> new CustomException(NOT_FOUND_USER_ERROR)
		);
		return ResponseAvailableVolunteerDetail.of(
			volunteer.getName(),
			volunteer.getPhone(),
			volunteer.getProfileImage(),
			volunteer.getBio(),
			volunteer.getVolunteerActivities().size() * 3
		);
	}
}
