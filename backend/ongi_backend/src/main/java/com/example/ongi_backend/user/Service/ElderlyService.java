package com.example.ongi_backend.user.Service;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;
import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.aws.AwsSqsNotificationSender;
import com.example.ongi_backend.global.entity.CurrentMatching;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.redis.service.UnMatchingService;
import com.example.ongi_backend.user.Dto.ResponseElderlyMainPage;
import com.example.ongi_backend.user.Dto.ResponseMatchedUserInfo;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.dto.RequestMatching;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.volunteerActivity.service.VolunteerActivityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ElderlyService {
	private final ElderlyRepository elderlyRepository;
	private final VolunteerActivityService volunteerActivityService;
	private final UnMatchingService unMatchingService;
	private final VolunteerService volunteerService;
	private final UserService userService;
	private final AwsSqsNotificationSender awsSqsNotificationSender;

	@Transactional
	public ResponseMatchedUserInfo matching(RequestMatching request, String name) {
		if(Duration.between(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime(), request.getStartTime()).getSeconds() < 0L) {
			throw new CustomException(POST_TIME_ERROR);
		}

		Elderly elderly = (Elderly)userService.findUserByUserName(name, "elderly");
		if(volunteerActivityService.existVolunteerActivity(elderly, request.getStartTime().toLocalDate()) != null){
			throw new CustomException(ALREADY_REGISTERED_ERROR);
		}

		return volunteerService.matchingIfDayOfWeekTimeMatched(request,
			elderly);

	}

	@Transactional
	public void cancelMatching(Long id, String username) {
		VolunteerActivity findVolunteerActivity = volunteerActivityService.findById(id);
		// TODO : 현재 로그인된 노인의 정보를 가져오는 방법이 따로 있으면 수정
		Elderly elderly = elderlyRepository.findByUsername(username).orElseThrow(
			() -> new CustomException(NOT_FOUND_USER_ERROR)
		);
		if(!findVolunteerActivity.getElderly().equals(elderly)) {
			throw new CustomException(ACCESS_DENIED_ERROR);
		}
		if(findVolunteerActivity.getStatus().equals(MATCHING)) {
			volunteerActivityService.deleteActivity(id);
		} else if (findVolunteerActivity.getStatus().equals(PROGRESS)) {
			Volunteer volunteer = findVolunteerActivity.getVolunteer();

			awsSqsNotificationSender.cancelNotification(
				volunteer.getFcmToken(),
				elderly.getName(),
				volunteer.getId(),
				"volunteer"
			);
			volunteerActivityService.deleteActivity(id);
			unMatchingService.deleteUnMatchingById(id);
		}else{
			throw new CustomException(UNAVAILABLE_CANCLE_VOLUNTEER_ACTIVITY_ERROR);
		}
	}

	@Transactional
	public void completeVolunteerActivity(Long matchingId, String username){
		VolunteerActivity volunteerActivity = volunteerActivityService.findById(matchingId);
		if(volunteerActivity.getStatus().equals(PROGRESS)){
			volunteerActivity.updateStatus(REVIEWING);
			Volunteer volunteer = volunteerActivity.getVolunteer();
			awsSqsNotificationSender.reviewNotification(
				volunteer.getFcmToken(),
				username,
				volunteer.getId()
			);
		}else{
			throw new CustomException(UNAVAILABLE_COMPLETE_VOLUNTEER_ACTIVITY_ERROR);
		}
	}

	public Elderly findElderlyById(Long id) {
		return elderlyRepository.findById(id)
			.orElseThrow(() -> new CustomException(NOT_FOUND_USER_ERROR));
	}

	public ResponseElderlyMainPage getElderlyMainPage(String name) {
		Elderly elderly = (Elderly)userService.findUserByUserName(name, "elderly");

		//오늘 날짜
		VolunteerActivity currentVa = elderly.getVolunteerActivities()
			.stream()
			.filter(volunteerActivity ->
				volunteerActivity.getStartTime().toLocalDate().isEqual(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime().toLocalDate())
			).findAny().orElse(null);
		return ResponseElderlyMainPage.of(currentVa == null ? null : CurrentMatching.ElderlyOf(currentVa));
	}
}
