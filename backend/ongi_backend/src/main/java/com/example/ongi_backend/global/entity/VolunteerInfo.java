package com.example.ongi_backend.global.entity;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;

import java.util.List;

import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.volunteerActivity.service.VolunteerActivityService;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@Schema(description = "봉사자 정보")
public class VolunteerInfo{
	@Schema(description = "봉사자 이름", example = "홍길동")
	private String name;
	@Schema(description = "봉사자 전화번호", example = "010-1234-5678")
	private String phone;
	@Schema(description = "봉사자 프로필 이미지", example = "profile/bb0b4359-731e-4cf5-baf0-52251e6b2447")
	private String profileImage;
	@Schema(description = "봉사자 봉사 시간", example = "123")
	private Integer volunteerHours;
	public static VolunteerInfo of(Volunteer volunteer){
		return VolunteerInfo.builder()
			.name(volunteer.getName())
			.phone(volunteer.getPhone())
			.profileImage(volunteer.getProfileImage())
			.volunteerHours(VolunteerActivityService.calculateVolunteerHours(volunteer.getVolunteerActivities()))
			.build();
	}
}
