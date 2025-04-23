package com.example.ongi_backend.review.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.ongi_backend.global.entity.DistrictType;
import com.example.ongi_backend.global.entity.VolunteerType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ResponseDetailReview {
	@Schema(description = "노인 이름", example = "홍길동")
	private String elderlyName;
	@Schema(description = "봉사 종류", example = "HEATL")
	private VolunteerType volunteerType;
	@Schema(description = "봉사 지역", example = "GANGNAM")
	private DistrictType districtType;
	@Schema(description = "봉사 시간", example = "2023-10-01T10:00:00")
	private LocalDateTime startTime;
	@Schema(description = "봉사 후기 사진", example = "[\"https://example.com/image1.jpg\", \"https://example.com/image2.jpg\"]")
	private List<String> imageUrls;
	@Schema(description = "봉사 후기 내용", example = "노인분이 너무 친절하셨습니다.")
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
