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

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/volunteerActivity")
public class VolunteerActivityController {
	private final VolunteerActivityService volunteerActivityService;

	//TODO : 추후 Redis를 통해 조회
	@GetMapping
	public ResponseEntity<?> getVolunteerActivityList() {
		return null;
	}

	@GetMapping("/complete")
	public ResponseEntity<List<ResponseCompletedActivity>> getCompleteVolunteerActivities(Principal principal) {
		return ResponseEntity.ok(volunteerActivityService.findCompleteVolunteerActivities(
			"username"
			//TODO : 로그인 구현 후 코드 수정
			// principal.getName()
		));
	}

	//TODO : 추후 Redis를 통해 조회
	@GetMapping("/incomplete")
	public ResponseEntity<?> getIncompleteVolunteerActivityList() {
		return null;
	}

	@GetMapping("/registration")
	public ResponseEntity<List<ResponseRegisteredActivities>> getRegisteredVolunteerActivityList() {
		return ResponseEntity.ok(volunteerActivityService.findRegisteredActivities(
			"username"
			//TODO : 로그인 구현 후 코드 수정
			// principal.getName()
		));
	}

	@GetMapping("/registration/{volunteerActivityId}")
	public ResponseEntity<ResponseActivityDetail> getVolunteerActivityDetail(@PathVariable Long volunteerActivityId) {
		return ResponseEntity.ok(volunteerActivityService.findActivityDetail(volunteerActivityId));
	}

	@GetMapping("/matching")
	public ResponseEntity<List<ResponseMatching>> getMatchingVolunteerActivityList(Principal principal) {
		return ResponseEntity.ok(volunteerActivityService.findActivityMatches(
			// TODO : 로그인 구현 후 코드 수정
			// principal
			"username"
		));
	}

	@GetMapping("/matching/{volunteerActivityId}")
	public ResponseEntity<ResponseMatchingDetail> getActivityMatchingDetail(@PathVariable Long volunteerActivityId) {
		return ResponseEntity.ok(volunteerActivityService.findActivityMatchingDetail(volunteerActivityId));
	}

}
