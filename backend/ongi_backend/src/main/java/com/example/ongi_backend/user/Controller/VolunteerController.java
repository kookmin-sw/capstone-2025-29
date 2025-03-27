package com.example.ongi_backend.user.Controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ongi_backend.user.Dto.ScheduleRequest;
import com.example.ongi_backend.user.Service.VolunteerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/volunteer")
public class VolunteerController {
	private final VolunteerService volunteerService;

	@PostMapping("/schedule")
	public ResponseEntity<?> setSchedule(@RequestBody ScheduleRequest request, Principal principal) {
		volunteerService.updateSchedule(request.getSchedules(),
			"username"
			// TODO : 로그인 구현 후 주석 해제
			// principal.getName()
		);
		return null;
	}

}
