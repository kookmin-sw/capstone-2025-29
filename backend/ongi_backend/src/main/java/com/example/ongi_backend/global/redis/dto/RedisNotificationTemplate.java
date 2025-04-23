package com.example.ongi_backend.global.redis.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
@ToString
public class RedisNotificationTemplate {
	private Long id;
	@Schema(description = "알람 제목", example = "새로운 봉사 일정이 생겼어요!")
	private String title;
	@Schema(description = "알람 내용", example = "고길동님과의 일정")
	private String body;
	private LocalDateTime createdAt;

	// TODO : 필요한가?
	// private NotificationType notificationType;
	// private VolunteerType volunteerType;
}
