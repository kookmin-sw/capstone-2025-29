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

import com.example.ongi_backend.user.Dto.ResponseElderlyMainPage;
import com.example.ongi_backend.user.Dto.ResponseMatchedUserInfo;
import com.example.ongi_backend.user.Service.ElderlyService;
import com.example.ongi_backend.volunteerActivity.dto.RequestMatching;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/elderly")
public class ElderlyController {
	private final ElderlyService elderlyService;

	@GetMapping
	public ResponseEntity<ResponseElderlyMainPage> getElderlyMainPage(Principal principal) {
		return ResponseEntity.ok(elderlyService.getElderlyMainPage(principal.getName()));
	}

	@PostMapping("/matching")
	@Operation(summary = "최종 신청 내역 / 읽기 전용", description = "봉사활동 매칭서 작성, 매칭되었을 때는 봉사자 정보, 없을때는 null 응답")
	// TODO : 매칭 되었을 때 봉사자 정보 출력
	public ResponseEntity<ResponseMatchedUserInfo> activityMatching(@RequestBody @Valid RequestMatching request, Principal principal) {
		return ResponseEntity.ok(elderlyService.matching(request,
			principal.getName()
		));
	}

	@PostMapping("/matching/{matchingId}")
	@Operation(summary = "봉사 완료", description = "봉사가 끝났을 때 사용")
	public void completeMatching(@PathVariable Long matchingId, Principal principal) {
		elderlyService.completeVolunteerActivity(matchingId,
			principal.getName()
		);
	}

	@DeleteMapping("/matching/{matchingId}")
	@Operation(summary = "나의 신청 내역 2", description = "봉사 취소")
	public void cancelMatching(@PathVariable Long matchingId ,Principal principal) {
		elderlyService.cancelMatching(matchingId,
			principal.getName()
		);
	}
}
