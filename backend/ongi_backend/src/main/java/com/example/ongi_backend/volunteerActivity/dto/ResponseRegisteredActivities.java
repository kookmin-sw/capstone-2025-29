package com.example.ongi_backend.volunteerActivity.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

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
	// TODO : 스웨거 변경사항 확인
}
