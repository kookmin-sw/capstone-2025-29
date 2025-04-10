package com.example.ongi_backend.review.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.ongi_backend.global.entity.DistrictType;
import com.example.ongi_backend.global.entity.VolunteerType;

import lombok.Data;

@Data
public class ResponseDetailReview {
	private String elderlyName;
	private VolunteerType volunteerType;
	private DistrictType districtType;
	private LocalDateTime startTime;
	private List<String> imageUrls;
	private String content;
	public static ResponseDetailReview of(
		String elderlyName,
		VolunteerType volunteerType,
		DistrictType districtType,
		LocalDateTime startTime,
		List<String> imageUrls,
		String content
	) {
		ResponseDetailReview response = new ResponseDetailReview();
		response.elderlyName = elderlyName;
		response.volunteerType = volunteerType;
		response.districtType = districtType;
		response.startTime = startTime;
		response.imageUrls = imageUrls;
		response.content = content;
		return response;
	}
}
