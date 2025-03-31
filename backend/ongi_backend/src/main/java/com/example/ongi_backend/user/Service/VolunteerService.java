package com.example.ongi_backend.user.Service;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;
import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.entity.VolunteerType;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.redis.dto.UnMatching;
import com.example.ongi_backend.global.redis.repository.UnMatchingRepository;
import com.example.ongi_backend.user.Dto.ScheduleRequest;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.volunteerActivity.repository.VolunteerActivityRepository;
import com.example.ongi_backend.volunteerActivity.service.VolunteerActivityService;
import com.example.ongi_backend.weeklyAvailableTime.entity.WeeklyAvailableTime;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VolunteerService {
	private final VolunteerRepository volunteerRepository;
	private final VolunteerActivityService volunteerActivityService;
	private final UnMatchingRepository unMatchingRepository;
	private final VolunteerActivityRepository volunteerActivityRepository;

	@Transactional
	public void updateSchedule(List<ScheduleRequest.Schedules> schedules, String username) {
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
		volunteer.addWeeklyAvailableTime(collect);
		scanUnMatching(collect, volunteer);
	}

	@Transactional
	public void scanUnMatching(List<WeeklyAvailableTime> weeklyAvailableTimes, Volunteer volunteer) {
		unMatchingRepository.findAll().forEach(unMatching -> {
			weeklyAvailableTimes.forEach(weeklyAvailableTime -> {
				if(unMatching.getStartTime().getDayOfWeek().equals(weeklyAvailableTime.getDayOfWeek())
					&& unMatching.getStartTime().toLocalTime().equals(weeklyAvailableTime.getAvailableStartTime())
					&& (VolunteerType.getCategory(unMatching.getVolunteerType()) & weeklyAvailableTime.getVolunteer().getVolunteerCategory()) != 0
					&& unMatching.getAddress().getDistrict().equals(weeklyAvailableTime.getVolunteer().getAddress().getDistrict())) {
					volunteerActivityRepository.findByStartTimeAndVolunteer(unMatching.getStartTime(), volunteer).ifPresentOrElse(
						activity -> {
							// 이미 해당 날짜에 매칭된 경우
						},
						() -> {
							// TODO : 매칭 알림 전송
							unMatchingRepository.delete(unMatching);
							VolunteerActivity volunteerActivity = volunteerActivityRepository.findById(
								unMatching.getId()).orElseThrow(
								() -> new CustomException(NOT_FOUND_VOLUNTEER_ACTIVITY_ERROR)
							);
							volunteerActivity.updateStatus(PROGRESS);
							volunteerActivity.updateVolunteer(volunteer);
						}
					);
				}
			});
		});
	}

	@Transactional
	public void deleteMatching(Long id, String username) {
		// TODO : 중복되는 기능은 따로 메소드로 분리
		VolunteerActivity findVolunteerActivity = volunteerActivityService.findById(id);
		Volunteer volunteer = volunteerRepository.findByUsername(username).orElseThrow(
			() -> new CustomException(NOT_FOUND_USER_ERROR)
		);
		if (findVolunteerActivity.getVolunteer() == null || !findVolunteerActivity.getVolunteer().equals(volunteer)) {
			throw new CustomException(ACCESS_DENIED_ERROR);
		}
		if(findVolunteerActivity.getStatus().equals(PROGRESS)) {
			// TODO : 노인에게 봉사 취소 알림 전송
			findVolunteerActivity.updateVolunteer(null);
			findVolunteerActivity.updateStatus(MATCHING);
			// TODO : unMatchingService로 분리
			unMatchingRepository.save(
				UnMatching.builder()
					.id(findVolunteerActivity.getId())
					.elderlyId(findVolunteerActivity.getElderly().getId())
					.volunteerType(findVolunteerActivity.getType())
					.startTime(findVolunteerActivity.getStartTime())
					.animalType(findVolunteerActivity.getAnimalType())
					.address(findVolunteerActivity.getAddress())
					.addDescription(findVolunteerActivity.getAddDescription())
					.ttl(
						Duration.between(LocalDateTime.now(), findVolunteerActivity.getStartTime()).getSeconds())
					.build()
			);
		}else {
			throw new CustomException(UNAVAILABLE_CANCLE_VOLUNTEER_ACTIVITY_ERROR);
		}


		return ;
	}
}
