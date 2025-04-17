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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/aws")
@RequiredArgsConstructor
public class AwsController {
	private final AwsService awsService;
	@GetMapping("/s3/user/preSigned")
	public ResponseEntity<GetS3UrlDto> issuedPreSignedUrl(@RequestParam("type") String type, @RequestParam("userType") String userType, Principal principal) {
		return ResponseEntity.ok(awsService.getUserImagePreSignedUrl(
			principal.getName(), type, userType));
	}

	@GetMapping("/s3/review/preSigned")
	public ResponseEntity<List<GetS3UrlDto>> issuedPreSignedUrlForReview(@RequestParam("count") int count) {
		return ResponseEntity.ok(awsService.getReviewPreSignedUrl(count));
	}

}
