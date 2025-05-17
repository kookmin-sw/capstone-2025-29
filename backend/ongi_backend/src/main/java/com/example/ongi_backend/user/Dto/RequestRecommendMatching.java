package com.example.ongi_backend.user.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RequestRecommendMatching {
	@Schema(description = "봉사자 ID", example = "1")
	private Long volunteerId;
	@Schema(description = "봉사자 ID", example = "1")
	private Long matchingId;

	public static RequestRecommendMatching of(Long volunteerId, Long matchingId) {
		return RequestRecommendMatching.builder()
			.volunteerId(volunteerId)
			.matchingId(matchingId)
			.build();
	}
}
