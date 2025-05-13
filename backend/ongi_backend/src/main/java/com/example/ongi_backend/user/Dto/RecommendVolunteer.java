package com.example.ongi_backend.user.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecommendVolunteer {
	@Schema(description = "봉사자 이름", example = "김철수")
	private String name;
	@Schema(description = "봉사자 활동 시간", example = "123")
	private Integer volunteerActivityTime;
	@Schema(description = "봉사자 ID", example = "1")
	private Long volunteerId;
	@Schema(description = "봉사자 프로필 사진 URL", example = "profile/123-456-789")
	private String profileImageUrl;
	@Schema(description = "봉사자 자기소개", example = "산책을 좋아합니다")
	private String bio;
	public static RecommendVolunteer of(String name, Integer volunteerActivityTime, Long volunteerId, String profileImageUrl, String bio) {
		return RecommendVolunteer.builder()
			.name(name)
			.volunteerActivityTime(volunteerActivityTime)
			.volunteerId(volunteerId)
			.profileImageUrl(profileImageUrl)
			.bio(bio)
			.build();
	}
}
