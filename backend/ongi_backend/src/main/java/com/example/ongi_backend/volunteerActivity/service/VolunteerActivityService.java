package com.example.ongi_backend.volunteerActivity.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.volunteerActivity.dto.ResponseVolunteerActivities;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.volunteerActivity.repository.VolunteerActivityRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VolunteerActivityService {
	private final VolunteerActivityRepository volunteerActivityRepository;

	public List<ResponseVolunteerActivities> findCompleteVolunteerActivities(String username) {
		List<VolunteerActivity> completeList = volunteerActivityRepository.findCompleteActivitiesByUserName(username);
		return completeList.stream().map(va -> {
			return ResponseVolunteerActivities.builder()
				.id(va.getId())
				.type(va.getType())
				.time(va.getStartTime())
				.build();
		}).collect(Collectors.toList());
	}

	public List<?> findRegisteredActivities(String username) {
		List<VolunteerActivity> completeList = volunteerActivityRepository.findRegisteredActivitiesByUserName(username);
		return completeList.stream().map(va -> {
			return ResponseVolunteerActivities.builder()
				.id(va.getId())
				.type(va.getType())
				.time(va.getStartTime())
				.build();
		}).collect(Collectors.toList());
	}
}
