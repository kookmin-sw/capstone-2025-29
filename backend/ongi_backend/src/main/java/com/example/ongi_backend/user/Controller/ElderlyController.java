package com.example.ongi_backend.user.Controller;

import java.security.Principal;

import com.example.ongi_backend.user.Dto.RequestModifyChatBot;
import com.example.ongi_backend.user.Dto.ResponseChatBot;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ongi_backend.user.Dto.ResponseElderlyMainPage;
import com.example.ongi_backend.user.Dto.RequestMatching;
import com.example.ongi_backend.user.Dto.RequestRecommendMatching;
import com.example.ongi_backend.user.Dto.ResponseMatchedUserInfo;
import com.example.ongi_backend.user.Dto.ResponseRecommend;
import com.example.ongi_backend.user.Service.ElderlyService;
import com.example.ongi_backend.volunteerActivity.dto.RequestRecommend;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/elderly")
public class ElderlyController {
	private final ElderlyService elderlyService;

	@GetMapping
	@Operation(summary = "봉사탭", description = "봉사탭 메인 페이지")
	public ResponseEntity<ResponseElderlyMainPage> getElderlyMainPage(Principal principal) {
		return ResponseEntity.ok(elderlyService.getElderlyMainPage(principal.getName()));
	}

	@PostMapping("/matching")
	@Operation(summary = "최종 신청 내역 / 읽기 전용", description = "매칭되었을 때는 봉사자 정보, 없을때는 null 응답")
	public ResponseEntity<ResponseMatchedUserInfo> activityMatching(@RequestBody @Valid RequestMatching request, Principal principal) {
		return ResponseEntity.ok(elderlyService.matching(request,
			principal.getName()
		));
	}

	@PostMapping("/recommend")
	@Operation(summary = "봉사자 추천", description = "봉사자 추천")
	public ResponseEntity<ResponseRecommend> recommendVolunteer(@RequestBody @Valid RequestRecommend request, Principal principal) {
		return ResponseEntity.ok(elderlyService.recommendVolunteer(request,
			principal.getName()
		));
	}

	@PostMapping("/recommend/matching")
	@Operation(summary = "매칭추천", description = "추천된 봉사자 선택")
	public ResponseEntity<ResponseMatchedUserInfo> recommendMatching(@RequestBody @Valid RequestRecommendMatching request, Principal principal) {
		return ResponseEntity.ok(elderlyService.recommendMatching(request,
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

	@PatchMapping
	@Operation(summary = "ChatBot 이름 저장", description = "챗봇 저장")
	public ResponseEntity<?> updateChatBot(Principal principal, @RequestBody RequestModifyChatBot request) {
		elderlyService.updateElderlyChatBot(principal.getName(), request);
		return ResponseEntity.ok("챗봇 저장");
	}

	@GetMapping("/chatBot")
	@Operation(summary = "챗봇 이름 불러오기", description = "챗봇 불러오기")
	public ResponseEntity<ResponseChatBot> getChatBotByElderly(Principal principal) {
		ResponseChatBot response = elderlyService.getChatBot(principal.getName());
		return ResponseEntity.ok(response);
	}
}
