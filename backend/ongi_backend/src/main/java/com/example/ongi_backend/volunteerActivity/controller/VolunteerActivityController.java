package com.example.ongi_backend.volunteerActivity.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ongi_backend.volunteerActivity.dto.ResponseVolunteerActivities;
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
	public ResponseEntity<List<ResponseVolunteerActivities>> getCompleteVolunteerActivities(Principal principal) {
		return ResponseEntity.ok(volunteerActivityService.findCompleteVolunteerActivities(
			"username"
			//TODO : 로그인 구현 후 코드 수정
			// principal.getName()
		));
	}

	@GetMapping("/incomplete")
	public ResponseEntity<?> getIncompleteVolunteerActivityList() {
		return null;
	}

	@GetMapping("/registration")
	public ResponseEntity<?> getRegisteredVolunteerActivityList() {
		return ResponseEntity.ok(volunteerActivityService.findRegisteredActivities(
			"username"
			//TODO : 로그인 구현 후 코드 수정
			// principal.getName()
		));
	}

	@GetMapping("{volunteerActivityId}")
	public ResponseEntity<?> getVolunteerActivityDetail(@PathVariable String volunteerActivityId) {
		return null;
	}

}
