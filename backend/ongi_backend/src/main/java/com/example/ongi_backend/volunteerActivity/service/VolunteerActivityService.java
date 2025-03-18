package com.example.ongi_backend.volunteerActivity.service;

import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.volunteerActivity.dto.ResponseActivityDetail;
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

	public List<ResponseVolunteerActivities> findRegisteredActivities(String username) {
		List<VolunteerActivity> completeList = volunteerActivityRepository.findRegisteredActivitiesByUserName(username);
		return completeList.stream().map(va -> {
			return ResponseVolunteerActivities.builder()
				.id(va.getId())
				.type(va.getType())
				.time(va.getStartTime())
				.build();
		}).collect(Collectors.toList());
	}

	public ResponseActivityDetail findActivityDetail(Long volunteerActivityId) {
		return volunteerActivityRepository.findById(volunteerActivityId)
			.map(va -> {
				return ResponseActivityDetail.builder()
					.id(va.getId())
					.type(va.getType())
					.startTime(va.getStartTime())
					.animalType(va.getAnimalType())
					.addDescription(va.getAddDescription())
					.address(
						Address.builder()
							.detail(va.getAddress().getDetail())
							.district(va.getAddress().getDistrict())
							.build()
					)
					.build();
			})
			.orElseThrow(() -> new CustomException(NOT_FOUND_VOLUNTEER_ACTIVITY_ERROR));
	}
}
