package com.example.ongi_backend.volunteerActivity.service;

import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.volunteerActivity.dto.ResponseActivityDetail;
import com.example.ongi_backend.volunteerActivity.dto.ResponseCompletedActivities;
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

	public List<ResponseCompletedActivities> findCompleteVolunteerActivities(String username) {
		List<VolunteerActivity> completeList = volunteerActivityRepository.findCompleteActivitiesByUserName(username);
		return completeList.stream().map(va -> {
			return ResponseCompletedActivities.builder()
				.id(va.getId())
				.type(va.getType())
				.time(va.getStartTime())
				.elderlyName(va.getElderly().getName())
				.build();
		}).collect(Collectors.toList());
	}

	public List<ResponseRegisteredActivities> findRegisteredActivities(String username) {
		List<VolunteerActivity> completeList = volunteerActivityRepository.findRegisteredActivitiesByUserName(username);
		return completeList.stream().map(va -> {
			return ResponseRegisteredActivities.builder()
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
					.build();
			})
			.orElseThrow(() -> new CustomException(NOT_FOUND_VOLUNTEER_ACTIVITY_ERROR));
	}

	public ResponseMatchingDetail findActivityMatchingDetail(Long volunteerActivityId) {
		return volunteerActivityRepository.findActivityAndElderlyById(volunteerActivityId)
			.map(va -> {
				return ResponseMatchingDetail.builder()
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
					.build();
			})
			.orElseThrow(() -> new CustomException(NOT_FOUND_VOLUNTEER_ACTIVITY_ERROR));
	}
}
