package com.example.ongi_backend.global.aws.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ongi_backend.global.aws.dto.GetS3UrlDto;
import com.example.ongi_backend.global.aws.service.AwsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/aws")
@RequiredArgsConstructor
public class AwsController {
	private final AwsService awsService;
	@GetMapping("/s3/user/preSigned")
	@Operation(summary = "공통", description = "유저 프로필 사진 업로드를 위한 preSignedUrl 발급")
	public ResponseEntity<GetS3UrlDto> issuedPreSignedUrl(@Parameter(
		name = "type",
		description = "업로드할 사진의 타입",
		required = true,
		schema = @Schema(allowableValues = {"profile", "ai_profile"}, example = "profile"),
		example = "profile"
	) @RequestParam("type") String type,
		@Parameter(
			name = "userType",
			description = "유저 타입",
			required = true,
			schema = @Schema(allowableValues = {"elderly", "volunteer"}, example = "elderly")
		)
		@RequestParam("userType") String userType, Principal principal) {
		return ResponseEntity.ok(awsService.getUserImagePreSignedUrl(
			principal.getName(), type, userType));
	}

	@GetMapping("/s3/review/preSigned")
	@Operation(summary = "후기작성 / 사진 추가할 때", description = "리뷰 사진 업로드를 위한 preSignedUrl 발급")
	public ResponseEntity<List<GetS3UrlDto>> issuedPreSignedUrlForReview(
		@Parameter(
			name = "count",
			description = "업로드할 사진의 개수",
			required = true,
			example = "3"
		)
		@RequestParam("count") int count) {
		return ResponseEntity.ok(awsService.getReviewPreSignedUrl(count));
	}

}
