package com.example.ongi_backend.review.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import com.example.ongi_backend.global.entity.DistrictType;
import com.example.ongi_backend.global.entity.VolunteerType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class ResponseReview {
	@Schema(description = "리뷰 아이디", example = "1")
	private Long reviewId;
	@Schema(description = "노인 이름", example = "홍길동")
	private String elderlyName;
	@Schema(description = "봉사 종류", example = "HEALT")
	private VolunteerType type;
	@Schema(description = "봉사 지역", example = "GANGNAM")
	private DistrictType districtType;
	@Schema(description = "봉사 시간", example = "2023-10-01T10:00:00")
	private LocalDateTime startTime;

	public static ResponseReview of(
		Long reviewId,
		String elderlyName,
		VolunteerType type,
		DistrictType districtType,
		LocalDateTime startTime
	) {
		return ResponseReview.builder()
			.reviewId(reviewId)
			.elderlyName(elderlyName)
			.type(type)
			.districtType(districtType)
			.startTime(startTime)
			.build();
	}
}
