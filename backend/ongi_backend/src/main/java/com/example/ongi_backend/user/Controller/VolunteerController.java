package com.example.ongi_backend.user.Controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ongi_backend.user.Dto.ResponseAvailableVolunteerDetail;
import com.example.ongi_backend.user.Dto.ScheduleRequest;
import com.example.ongi_backend.user.Service.VolunteerService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/volunteer")
public class VolunteerController {
	private final VolunteerService volunteerService;

	@PostMapping("/schedule")
	@Operation(summary = "나의 봉사 가능 시간 설정", description = "봉사자 봉사 가능 시간, 봉사 타입 설정")
	public ResponseEntity<?> setSchedule(@Valid @RequestBody ScheduleRequest request, Principal principal) {
		volunteerService.updateSchedule(request.getSchedules(),request.getCategory(),
			principal.getName()
		);
		return null;
	}
	@DeleteMapping("/matching/{matchingId}")
	@Operation(summary = "매칭 내역 상세", description = "봉사 취소")
	public ResponseEntity<?> deleteMatching(@PathVariable Long matchingId, Principal principal) {
		volunteerService.deleteMatching(matchingId,
			principal.getName()
		);
		return null;
	}

	@GetMapping("/{volunteerId}")
	@Operation(summary = "매칭 추천 상세", description = "봉사자 추천 화면에서 상세 조회")
	public ResponseEntity<ResponseAvailableVolunteerDetail> getVolunteer(@PathVariable Long volunteerId) {
		return ResponseEntity.ok(volunteerService.getAvailableVolunteerDetail(volunteerId));
	}

}
