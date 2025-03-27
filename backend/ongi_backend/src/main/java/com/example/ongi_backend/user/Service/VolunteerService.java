package com.example.ongi_backend.user.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.exception.ErrorCode;
import com.example.ongi_backend.user.Dto.ScheduleRequest;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.weeklyAvailableTime.entity.WeeklyAvailableTime;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VolunteerService {
	private final VolunteerRepository volunteerRepository;

	@Transactional
	public void updateSchedule(List<ScheduleRequest.Schedules> schedules, String username) {
		Volunteer volunteer = volunteerRepository.findByUsername(username).orElseThrow(
			() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR)
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
	}
}
