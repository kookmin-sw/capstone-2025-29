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
public class ResponseMatching {
	@Schema(description = "매칭 ID", example = "1")
	private Long id;
	@Schema(description = "독거 노인 이름", example = "홍길동")
	private String elderlyName;
	@Schema(description = "봉사 타입", example = "CULTURE")
	private VolunteerType type;
	@Schema(description = "봉사 지역", example = "GANGNAM")
	private DistrictType districtType;
	private LocalDateTime startTime;
}
