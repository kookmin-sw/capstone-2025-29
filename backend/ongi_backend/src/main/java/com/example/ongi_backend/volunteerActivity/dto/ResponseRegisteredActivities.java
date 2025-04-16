package com.example.ongi_backend.volunteerActivity.dto;

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
public class ResponseRegisteredActivities {
	@Schema(description = "봉사활동 ID", example = "1")
	private Long id;
	@Schema(description = "봉사 활동 타입", example = "HEALTH")
	private VolunteerType type;
	private LocalDateTime time;
	@Schema(description = "봉사자 매칭 여부", example = "true")
	private boolean isMatched;
	@Schema(description = "봉사자 이름", example = "홍길동")
	private String volunteerName;
	@Schema(description = "봉사 지역구", example = "GANGNAM")
	private DistrictType districtType;
}
