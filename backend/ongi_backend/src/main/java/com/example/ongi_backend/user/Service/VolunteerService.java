package com.example.ongi_backend.user.Service;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;
import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.aws.AwsSqsNotificationSender;
import com.example.ongi_backend.global.entity.VolunteerType;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.redis.service.UnMatchingService;
import com.example.ongi_backend.user.Dto.ScheduleRequest;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.dto.RequestMatching;
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

	@Transactional
	public void updateSchedule(List<ScheduleRequest.Schedules> schedules, int category, String username) {
		Volunteer volunteer = volunteerRepository.findByUsername(username).orElseThrow(
			() -> new CustomException(NOT_FOUND_USER_ERROR)
		);
		List<WeeklyAvailableTime> collect = schedules.stream().map(schedule -> {
			return WeeklyAvailableTime.builder()
				.dayOfWeek(schedule.getDayOfWeek())
				.availableStartTime(schedule.getTime())
				.availableEndTime(schedule.getTime().plusHours(3))
				.volunteer(volunteer)
				.build();
		}).collect(Collectors.toList());
		volunteer.updateCategory(category);
		volunteer.addWeeklyAvailableTime(collect);
		scanUnMatching(collect, volunteer);
	}

	@Transactional
	public void scanUnMatching(List<WeeklyAvailableTime> weeklyAvailableTimes, Volunteer volunteer) {
		unMatchingService.findAllUnMatching().forEach(unMatching -> {
			weeklyAvailableTimes.forEach(weeklyAvailableTime -> {
				if(unMatching.getStartTime().getDayOfWeek().equals(weeklyAvailableTime.getDayOfWeek())
					&& unMatching.getStartTime().toLocalTime().equals(weeklyAvailableTime.getAvailableStartTime())
					&& (VolunteerType.getCategory(unMatching.getVolunteerType()) & weeklyAvailableTime.getVolunteer().getVolunteerCategory()) != 0
					&& unMatching.getAddress().getDistrict().equals(weeklyAvailableTime.getVolunteer().getAddress().getDistrict())) {
						volunteerActivityService.matchingIfNotAlreadyMatched(unMatching, volunteer);
				}
			});
		});
	}

	@Transactional
	public void deleteMatching(Long id, String username) {
		VolunteerActivity findVolunteerActivity = volunteerActivityService.findById(id);
		// TODO : 현재 로그인된 봉사자의 정보를 가져오는 방법이 따로 있으면 수정
		Volunteer volunteer = volunteerRepository.findByUsername(username).orElseThrow(
			() -> new CustomException(NOT_FOUND_USER_ERROR)
		);
		if (findVolunteerActivity.getVolunteer() == null || !findVolunteerActivity.getVolunteer().equals(volunteer)) {
			throw new CustomException(ACCESS_DENIED_ERROR);
		}
		if(findVolunteerActivity.getStatus().equals(PROGRESS)) {
			awsSqsNotificationSender.cancelNotification(
				findVolunteerActivity.getElderly().getFcmToken(),
				findVolunteerActivity.getElderly().getName()
			);
			findVolunteerActivity.updateVolunteer(null);
			findVolunteerActivity.updateStatus(MATCHING);

			unMatchingService.saveUnMatching(
				findVolunteerActivity.getId(),
				findVolunteerActivity.getElderly().getId(),
				findVolunteerActivity.getType(),
				findVolunteerActivity.getStartTime(),
				findVolunteerActivity.getAnimalType(),
				findVolunteerActivity.getAddress(),
				findVolunteerActivity.getAddDescription()
			);
		}else {
			throw new CustomException(UNAVAILABLE_CANCLE_VOLUNTEER_ACTIVITY_ERROR);
		}
	}

	@Transactional
	public void matchingIfDayOfWeekTimeMatched (RequestMatching request, Elderly elderly){
		DayOfWeek dayOfWeek = request.getStartTime().getDayOfWeek();
		LocalTime startTime = request.getStartTime().toLocalTime();
		LocalDate date = request.getStartTime().toLocalDate();
		Integer category = VolunteerType.getCategory(request.getVolunteerType());
		VolunteerActivity volunteerActivity = volunteerActivityService.addVolunteerActivity(request, elderly);
		volunteerRepository.findByWeeklyAvailableTime(dayOfWeek, startTime, date, category, request.getAddress()
			.getDistrict()).ifPresentOrElse(
			volunteer -> {
				awsSqsNotificationSender.matchingNotification(
					volunteer.getFcmToken(),
					elderly.getName()
				);
				awsSqsNotificationSender.matchingNotification(
					elderly.getFcmToken(),
					volunteer.getName()
				);
				awsSqsNotificationSender.scheduleNotification(
					volunteer.getFcmToken(),
					elderly.getName()
				);
				awsSqsNotificationSender.scheduleNotification(
					elderly.getFcmToken(),
					volunteer.getName()
				);
				volunteerActivity.updateStatus(PROGRESS);
				volunteerActivity.updateVolunteer(volunteer);
			},
			() -> {
				awsSqsNotificationSender.unMatchingNotification(
					elderly.getFcmToken()
				);
				unMatchingService.saveUnMatching(
					volunteerActivity.getId(),
					elderly.getId(),
					request.getVolunteerType(),
					request.getStartTime(),
					request.getAnimalType(),
					request.getAddress(),
					request.getAddDescription());
			});
	}
}
