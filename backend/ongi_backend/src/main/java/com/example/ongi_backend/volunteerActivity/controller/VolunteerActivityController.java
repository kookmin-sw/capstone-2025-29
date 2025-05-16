package com.example.ongi_backend.volunteerActivity.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ongi_backend.volunteerActivity.dto.ResponseActivityDetail;
import com.example.ongi_backend.volunteerActivity.dto.ResponseCompletedActivity;
import com.example.ongi_backend.volunteerActivity.dto.ResponseMatching;
import com.example.ongi_backend.volunteerActivity.dto.ResponseMatchingDetail;
import com.example.ongi_backend.volunteerActivity.dto.ResponseRegisteredActivities;
import com.example.ongi_backend.volunteerActivity.service.VolunteerActivityService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/volunteerActivity")
public class VolunteerActivityController {
	private final VolunteerActivityService volunteerActivityService;

	@GetMapping("/complete")
	@Operation(summary = "완료 / 후기", description = "봉사 완료 목록을 조회합니다.")
	public ResponseEntity<List<ResponseCompletedActivity>> getCompleteVolunteerActivities(Principal principal) {
		return ResponseEntity.ok(volunteerActivityService.findCompleteVolunteerActivities(
			principal.getName()
		));
	}

	@GetMapping("/registration")
	@Operation(summary = "나의 신청 내역", description = "봉사 신청 목록을 조회합니다.")
	public ResponseEntity<List<ResponseRegisteredActivities>> getRegisteredVolunteerActivityList(Principal principal) {
		return ResponseEntity.ok(volunteerActivityService.findRegisteredActivities(
			principal.getName()
		));
	}

	@GetMapping("/registration/{volunteerActivityId}")
	@Operation(summary = "나의 신청 내역2", description = "봉사 신청 상세 내역을 조회합니다.")
	public ResponseEntity<ResponseActivityDetail> getVolunteerActivityDetail(@PathVariable Long volunteerActivityId) {
		return ResponseEntity.ok(volunteerActivityService.findActivityDetail(volunteerActivityId));
	}

	@GetMapping("/matching")
	@Operation(summary = "매칭 내역", description = "봉사 매칭 목록을 조회합니다.")
	public ResponseEntity<List<ResponseMatching>> getMatchingVolunteerActivityList(Principal principal) {
		return ResponseEntity.ok(volunteerActivityService.findActivityMatches(
			principal.getName()
		));
	}

	@GetMapping("/matching/{volunteerActivityId}")
	@Operation(summary = "매칭 내역 상세", description = "봉사 매칭 상세 내역을 조회합니다.")
	public ResponseEntity<ResponseMatchingDetail> getActivityMatchingDetail(@PathVariable Long volunteerActivityId) {
		return ResponseEntity.ok(volunteerActivityService.findActivityMatchingDetail(volunteerActivityId));
	}

}
