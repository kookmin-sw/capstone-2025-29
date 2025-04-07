package com.example.ongi_backend.global.aws;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.example.ongi_backend.global.aws.dto.SqsMessage;
import com.example.ongi_backend.global.redis.service.NotificationRedisService;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.awspring.cloud.sqs.operations.SendResult;
import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class AwsSqsNotificationSender implements NotificationSender {
	private final SqsTemplate sqsTemplate;
	@Value("${cloud.aws.sqs.queue.name}")
	private String queueName;
	private final ObjectMapper objectMapper;
	private final TaskScheduler taskScheduler;
	private final NotificationRedisService notificationRedisService;
	@Override
	public void sendNotification(SqsMessage SqsMessage) {
		try{
			String message = objectMapper.writeValueAsString(SqsMessage);
			SendResult<String> result = sqsTemplate.send(to -> to.queue(queueName).payload(message));
			System.out.println("result = " + result);
		}catch (Exception e) {
			log.error("send notification error : ", e);
		}
	}

	public void matchingNotification(String fcmToken, String otherUserName, Long userId, String userType){
		sendNotification(makeNotification(fcmToken, "새로운 봉사 일정이 생겼어요!", otherUserName + "님과의 일정"));
		notificationRedisService.matchingNotificationInRedis(userId, userType, otherUserName);
	}
	public void cancelNotification(String fcmToken, String otherUserName, Long userId, String userType){
		sendNotification(makeNotification(fcmToken, "매칭이 취소되었습니다!", otherUserName + "님과의 매칭 취소"));
		notificationRedisService.cancelNotificationInRedis(userId, userType, otherUserName);
	}
	public void reviewNotification(String fcmToken, String otherUserName, Long userId){
		sendNotification(makeNotification(fcmToken, "이번 봉사는 어떠셨나요?", otherUserName + "님과의 봉사 리뷰를 작성해주세요"));
		notificationRedisService.reviewNotificationInRedis(userId, "volunteer", otherUserName);
	}
	//TODO : 매칭이 취소 되었을 떄 해당 알림을 제거해야 되는지? 그냥 넘어가기?
	public void scheduleNotification(String fcmToken, String otherUserName, Long userId, String userType){
		sendNotification(makeNotification(fcmToken, "봉사 시작까지 얼마남지 않았아요!", otherUserName + "님과의 봉사 한 시간 전입니다"));
		notificationRedisService.scheduleNotificationInRedis(userId, userType, otherUserName);
	}
	public void unMatchingNotification(String fcmToken, Long userId) {
		sendNotification(makeNotification(fcmToken, "봉사자 매칭 중", "봉사자가 매칭되면 알림을 보내드리겠습니다!"));
		notificationRedisService.unMatchingNotificationInRedis(userId, "elderly");
	}
	public void expireNotification(String fcmToken, Long userId) {
		sendNotification(makeNotification(fcmToken, "봉사 일정이 만료되었습니다!", "봉사자가 매칭되지 않았습니다"));
		notificationRedisService.ExpireNotificationInRedis(userId);
	}

	private SqsMessage makeNotification(String fcmToken, String title, String body){
		return SqsMessage.builder()
			.messageBody("{ \"message\": \"푸시 알람 요청\" }")
			.messageAttributes(SqsMessage.MessageAttributes.builder()
				.title(SqsMessage.MessageAttribute.builder().dataType("String").stringValue(title).build())
				.body(SqsMessage.MessageAttribute.builder()
					.dataType("String")
					.stringValue(body)
					.build())
				.token(SqsMessage.MessageAttribute.builder().dataType("String").stringValue(fcmToken).build())
				.build()
			).build();
	}

	//TODO : @Async가 적절한지 테스트 후 수정
	@Async
	public void setSchedulingMessageWithTaskScheduler(LocalDateTime time, String fcmToken, String otherUserName, Long userId, String userType) {
		// 봉사까지 1시간도 안남았으면 즉시 전송
		if(Duration.between(LocalDateTime.now(), time).getSeconds() <= 3600L){
			scheduleNotification(fcmToken, otherUserName, userId, userType);
			return ;
		}
		Date executionTime = Date.from(time.minusHours(1).atZone(ZoneId.systemDefault()).toInstant());
		// TODO : cloud 환경에서 실제로 1시간 전에 알림이 가는지 확인
		taskScheduler.schedule(() -> {
			scheduleNotification(fcmToken, otherUserName, userId, userType);
		}, executionTime);
	}

}
