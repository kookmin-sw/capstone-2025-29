package com.example.ongi_backend.volunteerActivity.service;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;
import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.aws.AwsSqsNotificationSender;
import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.redis.dto.UnMatching;
import com.example.ongi_backend.global.redis.service.UnMatchingService;
import com.example.ongi_backend.user.Dto.ResponseMatchedUserInfo;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.dto.RequestRecommend;
import com.example.ongi_backend.volunteerActivity.dto.ResponseActivityDetail;
import com.example.ongi_backend.volunteerActivity.dto.ResponseCompletedActivity;
import com.example.ongi_backend.volunteerActivity.dto.ResponseMatching;
import com.example.ongi_backend.volunteerActivity.dto.ResponseMatchingDetail;
import com.example.ongi_backend.volunteerActivity.dto.ResponseRegisteredActivities;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.volunteerActivity.repository.VolunteerActivityRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VolunteerActivityService {
	private final VolunteerActivityRepository volunteerActivityRepository;
	private final AwsSqsNotificationSender awsSqsNotificationSender;
	private final UnMatchingService unMatchingService;
	private final ElderlyRepository elderlyRepository;

	public List<ResponseCompletedActivity> findCompleteVolunteerActivities(String username) {
		List<VolunteerActivity> completeList = volunteerActivityRepository.findCompleteActivitiesByUserName(username);
		return completeList.stream().map(va -> ResponseCompletedActivity.builder()
			.id(va.getId())
			.type(va.getType())
			.time(va.getStartTime())
			.elderlyName(va.getElderly().getName())
			.districtType(va.getAddress().getDistrict())
			.build()).collect(Collectors.toList());
	}

	public List<ResponseRegisteredActivities> findRegisteredActivities(String username) {
		List<VolunteerActivity> completeList = volunteerActivityRepository.findRegisteredActivitiesByUserName(username);
		return completeList.stream().map(va -> ResponseRegisteredActivities.builder()
			.id(va.getId())
			.type(va.getType())
			.time(va.getStartTime())
			.isMatched(va.getVolunteer() != null)
			.volunteerName(va.getVolunteer() != null ? va.getVolunteer().getName() : null)
			.districtType(va.getAddress().getDistrict())
			.build()).collect(Collectors.toList());
	}

	public ResponseActivityDetail findActivityDetail(Long volunteerActivityId) {
		return volunteerActivityRepository.findById(volunteerActivityId)
			.map(va -> ResponseActivityDetail.builder()
				.id(va.getId())
				.type(va.getType())
				.startTime(va.getStartTime())
				.animalType(va.getAnimalType())
				.addDescription(va.getAddDescription())
				.matchedUserInfo(
					va.getVolunteer() != null ?
						ResponseMatchedUserInfo.of(va.getVolunteer().getName(), va.getVolunteer().getPhone(),
							va.getVolunteer().getProfileImage(),
							VolunteerActivityService.calculateVolunteerHours(va.getVolunteer().getVolunteerActivities())) : null
				)
				.build())
			.orElseThrow(() -> new CustomException(NOT_FOUND_VOLUNTEER_ACTIVITY_ERROR));
	}

	public ResponseMatchingDetail findActivityMatchingDetail(Long volunteerActivityId) {
		return volunteerActivityRepository.findActivityAndElderlyById(volunteerActivityId)
			.map(va -> ResponseMatchingDetail.builder()
				.id(va.getId())
				.type(va.getType())
				.startTime(va.getStartTime())
				.animalType(va.getAnimalType())
				.addDescription(va.getAddDescription())
				.elderlyName(va.getElderly().getName())
				.address(
					Address.builder()
						.detail(va.getAddress().getDetail())
						.district(va.getAddress().getDistrict())
						.build()
				)
				.build())
			.orElseThrow(() -> new CustomException(NOT_FOUND_VOLUNTEER_ACTIVITY_ERROR));
	}

	public List<ResponseMatching> findActivityMatches(String userName) {
		return volunteerActivityRepository.findMatchingByUserName(userName).stream().map(va -> ResponseMatching.builder()
			.id(va.getId())
			.elderlyName(va.getElderly().getName())
			.type(va.getType())
			.districtType(va.getAddress().getDistrict())
			.startTime(va.getStartTime())
			.build()).collect(Collectors.toList());
	}

	@Transactional
	public VolunteerActivity addVolunteerActivity(RequestRecommend request, Elderly elderly) {
		VolunteerActivity volunteerActivity = VolunteerActivity.builder()
			.elderly(elderly)
			.volunteer(null)
			.type(request.getVolunteerType())
			.addDescription(request.getAddDescription())
			.startTime(request.getStartTime())
			.animalType(request.getAnimalType())
			.status(MATCHING)
			.address(request.getAddress())
			.build();
		return volunteerActivityRepository.save(volunteerActivity);
	}

	public VolunteerActivity findById(Long id) {
		return volunteerActivityRepository.findById(id)
			.orElseThrow(() -> new CustomException(NOT_FOUND_VOLUNTEER_ACTIVITY_ERROR));
	}

	@Transactional
	public void matchingIfNotAlreadyMatched(UnMatching unMatching, Volunteer volunteer) {
		volunteerActivityRepository.findByStartTimeAndVolunteer(unMatching.getStartTime().toLocalDate(), volunteer).ifPresentOrElse(
			activity -> {
				// 이미 해당 날짜에 매칭된 경우
			},
			() -> {
				unMatchingService.deleteUnMatching(unMatching);
				VolunteerActivity volunteerActivity = findById(unMatching.getId());
				volunteerActivity.updateStatus(PROGRESS);
				volunteerActivity.updateVolunteer(volunteer);
				Elderly elderly = elderlyRepository.findById(unMatching.getElderlyId()).orElseThrow(
					() -> new CustomException(NOT_FOUND_USER_ERROR)
				);

				awsSqsNotificationSender.matchingNotification(
					elderly.getFcmToken(),
					volunteer.getName(),
					elderly.getId(),
					"elderly"
				);
				awsSqsNotificationSender.matchingNotification(
					volunteer.getFcmToken(),
					elderly.getName(),
					volunteer.getId(),
					"volunteer"
				);
				awsSqsNotificationSender.setSchedulingMessageWithTaskScheduler(
					volunteerActivity,
					elderly,
					volunteer,
					"volunteer"
				);
				awsSqsNotificationSender.setSchedulingMessageWithTaskScheduler(
					volunteerActivity,
					elderly,
					volunteer,
					"elderly"
				);
			}
		);
	}

	@Transactional
	public void deleteActivity(Long id) {
		volunteerActivityRepository.deleteById(id);
	}
	@Transactional
	public void expireActivity(Long id) {
		VolunteerActivity activity = findById(id);
		Elderly elderly = activity.getElderly();
		deleteActivity(id);
		awsSqsNotificationSender.expireNotification(elderly.getFcmToken(), elderly.getId());
	}
	public VolunteerActivity existVolunteerActivity(Elderly elderly, LocalDate startDate) {
		return volunteerActivityRepository.findVaByElderlyAndDate(elderly, startDate).orElse(null);
	}
	public static Integer calculateVolunteerHours(List<VolunteerActivity> volunteerActivities) {
		return volunteerActivities.stream()
			.filter(va -> va.getStatus() == COMPLETED)
			.mapToInt(va -> 3)
			.sum();
	}
}
