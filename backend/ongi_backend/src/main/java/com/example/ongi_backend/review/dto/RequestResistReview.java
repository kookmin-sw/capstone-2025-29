package com.example.ongi_backend.review.dto;

import java.util.List;

import lombok.Data;

@Data
public class RequestResistReview {
	private Long volunteerActivityId;
	private String content;
	private List<String> imageUrls;
}
