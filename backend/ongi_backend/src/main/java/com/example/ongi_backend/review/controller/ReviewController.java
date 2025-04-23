package com.example.ongi_backend.review.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ongi_backend.review.dto.RequestResistReview;
import com.example.ongi_backend.review.dto.ResponseDetailReview;
import com.example.ongi_backend.review.dto.ResponseReview;
import com.example.ongi_backend.review.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
	private final ReviewService reviewService;
	@GetMapping
	@Operation(summary = "완료 후기", description = "리뷰 조회")
	public ResponseEntity<List<ResponseReview>> getReviews(Principal principal) {
		return ResponseEntity.ok(
			reviewService.findReviews(
				principal.getName()
			));
	}

	@GetMapping("/{volunteerActivityId}")
	@Operation(summary = "후기 / 사진추가", description = "리뷰 상세 조회")
	public ResponseEntity<ResponseDetailReview> getReview(@PathVariable Long volunteerActivityId, Principal principal) {
		return ResponseEntity.ok(reviewService.findDetailsReview(volunteerActivityId,
			principal.getName()
		));
	}

	@PostMapping
	@Operation(summary = "후기작성", description = "리뷰 작성하기")
	public ResponseEntity<?> writeReview(@RequestBody @Valid RequestResistReview request, Principal principal) {
		reviewService.writeReview(
			request,
			principal.getName()
		);
		return ResponseEntity.ok("리뷰 작성하기");
	}
}
