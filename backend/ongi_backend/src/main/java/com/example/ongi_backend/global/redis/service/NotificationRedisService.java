package com.example.ongi_backend.global.redis.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.redis.dto.RedisNotificationTemplate;
import com.example.ongi_backend.user.Service.UserService;
import com.example.ongi_backend.user.entity.BaseUser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class NotificationRedisService {
	private final RedisTemplate<String, String> redisTemplate;
	private final ObjectMapper objectMapper;
	private final UserService userService;
	//TODO : 지금은 알림 10분 만료, 이후 시간 조정 필요시 수정
	private static final Duration TTL = Duration.ofMinutes(10L);

	public void matchingNotificationInRedis(Long userId, String userType, String otherUserName) {
		RedisNotificationTemplate notification = makeNotification(userId, "새로운 봉사 일정이 생겼어요!", otherUserName + "님과의 일정이 생겼어요! 지금 확인해 보세요.");
		saveNotificationInRedis(userId, notification, userType);
	}
	public void cancelNotificationInRedis(Long userId, String userType, String otherUserName) {
		RedisNotificationTemplate notification = makeNotification(userId, "봉사 일정이 취소되었어요!", "봉사자님! 일정 취소가 발생했어요. 확인해 주세요.");
		saveNotificationInRedis(userId, notification, userType);
	}
	public void reviewNotificationInRedis(Long userId, String userType, String otherUserName) {
		RedisNotificationTemplate notification = makeNotification(userId, "봉사 일정이 리뷰 작성 대기 중이에요!", "일정이 완료되었나요? 후기를 작성해 주세요.");
		saveNotificationInRedis(userId, notification, userType);
	}
	public void scheduleNotificationInRedis(Long userId, String userType, String otherUserName) {
		RedisNotificationTemplate notification = makeNotification(userId, "봉사 시간까지 얼마남지 않았어요!", "곧 " + otherUserName  + "님과의 일정이 있어요.");
		saveNotificationInRedis(userId, notification, userType);
	}
	public void unMatchingNotificationInRedis(Long userId, String userType) {
		RedisNotificationTemplate notification = makeNotification(userId, "봉사자 매칭 중", "잠시만 기다려주세요. 최대한 빨리 매칭해드릴게요.");
		saveNotificationInRedis(userId, notification, userType);
	}
	public void ExpireNotificationInRedis(Long userId) {
		RedisNotificationTemplate notification = makeNotification(userId, "봉사 일정이 만료되었습니다!", "해당 시간은 매칭이 어려워 취소되었습니다. 다시 신청해 주세요.");
		saveNotificationInRedis(userId, notification, "elderly");

	}

	@Transactional
	public void saveNotificationInRedis(Long userId, RedisNotificationTemplate notification, String userType) {
		//키 uuid 설정
		String key = String.format("notification:%s:%s:%s", userType, userId, UUID.randomUUID());
		try {
			redisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(notification));
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
		// 각 메시지마다 10분의 TTL을 설정
		redisTemplate.expire(key, TTL);
	}

	public List<RedisNotificationTemplate> findNotification(String userName, String userType) {
		BaseUser user = userService.findUserByUserName(userName, userType);
		String key = String.format("notification:%s:%s:*", userType, user.getId());
		Set<String> keys = redisTemplate.keys(key);
		List<RedisNotificationTemplate> notifications = redisTemplate.opsForValue()
			.multiGet(keys)
			.stream()
			.map(notification -> {
				try {
					return objectMapper.readValue(notification, RedisNotificationTemplate.class);
				} catch (JsonProcessingException e) {
					throw new RuntimeException(e);
				}
			})
			.filter(Objects::nonNull)
			.sorted(Comparator.comparing(RedisNotificationTemplate::getCreatedAt).reversed())
			.collect(Collectors.toList());
		return notifications;
	}

	private RedisNotificationTemplate makeNotification(Long userId, String title, String body) {
		return RedisNotificationTemplate.builder()
			.id(userId)
			.title(title)
			.body(body)
			.createdAt(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime())
			.build();
	}
}
