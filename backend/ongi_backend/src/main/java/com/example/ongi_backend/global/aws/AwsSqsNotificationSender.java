package com.example.ongi_backend.global.aws;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

import com.example.ongi_backend.global.aws.dto.SqsMessage;
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

	public void matchingNotification(String fcmToken, String otherUserName){
		sendNotification(makeNotification(fcmToken, "새로운 봉사 일정이 생겼어요!", otherUserName + "님과의 일정"));
	}
	public void cancelNotification(String fcmToken, String otherUserName){
		sendNotification(makeNotification(fcmToken, "매칭이 취소되었습니다!", otherUserName + "님과의 매칭 취소"));
	}
	public void reviewNotification(String fcmToken, String otherUserName){
		sendNotification(makeNotification(fcmToken, "이번 봉사는 어떠셨나요?", otherUserName + "님과의 봉사 리뷰를 작성해주세요"));
	}
	public void scheduleNotification(String fcmToken, String otherUserName){
		sendNotification(makeNotification(fcmToken, "봉사 시작까지 얼마남지 않았아요!", otherUserName + "님과의 봉사 한 시간 전입니다"));
	}
	public void unMatchingNotification(String fcmToken) {
		sendNotification(makeNotification(fcmToken, "봉사자 매칭 중", "봉사자가 매칭되면 알림을 보내드리겠습니다!"));
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

	public void testTaskScheduler(LocalDateTime time){
		Date executionTime = Date.from(time.minusMinutes(1).atZone(ZoneId.systemDefault()).toInstant());

		taskScheduler.schedule(() -> {
			System.out.println("test task");
			matchingNotification("fcmToken", "otherUserName");
		}, executionTime);
	}

}
