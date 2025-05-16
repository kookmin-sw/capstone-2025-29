package com.example.ongi_backend.user.Dto;

import static lombok.AccessLevel.*;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
public class ResponseMatchedUserInfo {
	@Schema(description = "봉사자 이름", example = "홍길동")
	private String volunteerName;
	@Schema(description = "봉사자 전화번호", example = "010-1234-5678")
	private String phone;
	@Schema(description = "봉사자 프로필 이미지", example = "/profile.image.jpg")
	private String profileImage;
	@Schema(description = "봉사시간", example = "123")
	private Integer volunteerActivityTime;

	public static ResponseMatchedUserInfo of(String volunteerName, String phone, String profileImage, Integer volunteerActivityTime) {
		return ResponseMatchedUserInfo.builder()
			.volunteerName(volunteerName)
			.phone(phone)
			.profileImage(profileImage)
			.volunteerActivityTime(volunteerActivityTime)
			.build();
	}
}
