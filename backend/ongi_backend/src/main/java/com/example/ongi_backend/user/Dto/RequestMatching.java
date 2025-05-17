package com.example.ongi_backend.user.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RequestMatching {
	@Schema(description = "매칭 아이디", example = "1")
	private Long matchingId;

	public static RequestMatching of(Long matchingId) {
		return RequestMatching.builder()
			.matchingId(matchingId)
			.build();
	}
}
