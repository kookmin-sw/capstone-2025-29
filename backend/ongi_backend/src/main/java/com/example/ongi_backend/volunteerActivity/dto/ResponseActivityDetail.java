package com.example.ongi_backend.volunteerActivity.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import com.example.ongi_backend.global.entity.AnimalType;
import com.example.ongi_backend.global.entity.VolunteerType;
import com.example.ongi_backend.user.Dto.ResponseMatchedUserInfo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class ResponseActivityDetail {
	@Schema(description = "봉사활동 ID", example = "1")
	private Long id;
	@Schema(description = "봉사 활동 타입", example = "HEALTH")
	private VolunteerType type;
	private LocalDateTime startTime;
	@Schema(description = "노인 애완 동물 여부", example = "cat")
	private AnimalType animalType;
	@Schema(description = "추가 요청 사항", example = "올 때 메로나 사다주세요")
	private String addDescription;
	@Schema(description = "매칭된 봉사자 정보")
	private ResponseMatchedUserInfo matchedUserInfo;
}
