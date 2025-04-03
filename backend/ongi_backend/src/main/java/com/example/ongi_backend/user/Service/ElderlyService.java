package com.example.ongi_backend.user.Service;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;
import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.aws.AwsSqsNotificationSender;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.redis.service.UnMatchingService;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.entity.Elderly;
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
	private final AwsSqsNotificationSender awsSqsNotificationSender;

	@Transactional
	public void matching(RequestMatching request, String name) {

		if(Duration.between(LocalDateTime.now(), request.getStartTime()).getSeconds() < 0L) {
			throw new CustomException(POST_TIME_ERROR);
		}

		//TODO : 현재 로그인된 노인의 정보를 가져오는 방법이 따로 있으면 수정
		Elderly elderly = elderlyRepository.findByUsername(name)
			.orElseThrow(() -> new CustomException(NOT_FOUND_USER_ERROR));

		volunteerService.matchingIfDayOfWeekTimeMatched(request, elderly);
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
		if(findVolunteerActivity.getStatus().equals(PROGRESS)) {
			volunteerActivityService.deleteActivity(id);
		} else if (findVolunteerActivity.getStatus().equals(MATCHING)) {
			awsSqsNotificationSender.cancelNotification(
				findVolunteerActivity.getVolunteer().getUsername(),
				findVolunteerActivity.getElderly().getName()
			);
			awsSqsNotificationSender.cancelNotification(
				findVolunteerActivity.getVolunteer().getFcmToken(),
				findVolunteerActivity.getVolunteer().getName()
			);
			volunteerActivityService.deleteActivity(id);
			unMatchingService.deleteUnMatchingById(id);
		}else{
			throw new CustomException(UNAVAILABLE_CANCLE_VOLUNTEER_ACTIVITY_ERROR);
		}
	}

	public Elderly findElderlyById(Long id) {
		return elderlyRepository.findById(id)
			.orElseThrow(() -> new CustomException(NOT_FOUND_USER_ERROR));
	}
}
