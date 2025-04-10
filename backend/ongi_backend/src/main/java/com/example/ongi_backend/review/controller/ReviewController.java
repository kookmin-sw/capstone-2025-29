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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
	private final ReviewService reviewService;
	@GetMapping
	public ResponseEntity<List<ResponseReview>> getReviews(Principal principal) {
		return ResponseEntity.ok(
			reviewService.findReviews(
				//TODO : 로그인 구현 후 수정
				// principal.getName()
				"username"
			));
	}

	@GetMapping("/{volunteerActivityId}")
	public ResponseEntity<ResponseDetailReview> getReview(@PathVariable Long volunteerActivityId, Principal principal) {
		return ResponseEntity.ok(reviewService.findDetailsReview(volunteerActivityId,
			//TODO : 로그인 구현 후 수정
			// principal.getName()
			"username"
		));
	}

	@PostMapping
	public ResponseEntity<?> writeReview(@RequestBody @Valid RequestResistReview request, Principal principal) {
		reviewService.writeReview(request
			//TODO : 로그인 구현 후 수정
			// principal.getName()
			, "username"
		);
		return ResponseEntity.ok("리뷰 작성하기");
	}
}
