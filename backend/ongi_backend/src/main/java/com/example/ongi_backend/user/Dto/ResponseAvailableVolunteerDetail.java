package com.example.ongi_backend.user.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseAvailableVolunteerDetail {
	@Schema(description = "봉사자 이름", example = "홍길동")
	private String name;
	@Schema(description = "봉사자 프로필 사진 URL", example = "profile/123-456-789")
	private String profileImageUrl;
	@Schema(description = "봉사자 전화번호", example = "010-1234-5678")
	private String phone;
	@Schema(description = "봉사자 자기소개", example = "산책 좋아합니다")
	private String bio;
	@Schema(description = "봉사자 활동 시간", example = "123")
	private Integer volunteerActivityTime;
	public static ResponseAvailableVolunteerDetail of(String name, String profileImageUrl, String phone, String bio, Integer volunteerActivityTime) {
		return ResponseAvailableVolunteerDetail.builder()
			.name(name)
			.profileImageUrl(profileImageUrl)
			.phone(phone)
			.bio(bio)
			.volunteerActivityTime(volunteerActivityTime)
			.build();
	}
}
