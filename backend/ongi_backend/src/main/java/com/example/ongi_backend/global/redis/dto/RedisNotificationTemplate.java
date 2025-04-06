package com.example.ongi_backend.global.redis.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

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
	private String title;
	private String body;
	private LocalDateTime createdAt;

	// TODO : 필요한가?
	// private NotificationType notificationType;
	// private VolunteerType volunteerType;
}
