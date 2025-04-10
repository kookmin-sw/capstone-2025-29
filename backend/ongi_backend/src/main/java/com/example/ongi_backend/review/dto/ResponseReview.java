package com.example.ongi_backend.review.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import com.example.ongi_backend.global.entity.DistrictType;
import com.example.ongi_backend.global.entity.VolunteerType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class ResponseReview {
	private Long reviewId;
	private String elderlyName;
	private VolunteerType type;
	private DistrictType districtType;
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
