package com.example.ongi_backend.global.aws;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.example.ongi_backend.global.aws.dto.SqsMessage;
import com.example.ongi_backend.global.redis.service.NotificationRedisService;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.volunteerActivity.repository.VolunteerActivityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.services.sqs.SqsAsyncClient;
import software.amazon.awssdk.services.sqs.model.MessageAttributeValue;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

@Slf4j
@RequiredArgsConstructor
@Component
public class AwsSqsNotificationSender implements NotificationSender {
	@Value("${cloud.aws.sqs.queue.name}")
	private String queueName;
	private final SqsAsyncClient sqsAsyncClient;
	private final TaskScheduler taskScheduler;
	private final NotificationRedisService notificationRedisService;
	private final VolunteerActivityRepository volunteerActivityRepository;
	@Override
	public void sendNotification(SqsMessage SqsMessage) {
		try{
			SendMessageRequest sendMessageRequest = makeSqsMessage(SqsMessage);
			sqsAsyncClient.sendMessage(sendMessageRequest).get();
		}catch (Exception e) {
			log.error("send notification error : ", e);
		}
	}

	private SendMessageRequest makeSqsMessage(SqsMessage SqsMessage) {
		Map<String, MessageAttributeValue> attributes = new HashMap<>();
		attributes.put("title", MessageAttributeValue.builder()
			.dataType("String")
			.stringValue(SqsMessage.getMessageAttributes().getTitle().getStringValue())
			.build());
		attributes.put("body", MessageAttributeValue.builder()
			.dataType("String")
			.stringValue(SqsMessage.getMessageAttributes().getBody().getStringValue())
			.build());
		attributes.put("token", MessageAttributeValue.builder()
			.dataType("String")
			.stringValue(SqsMessage.getMessageAttributes().getToken().getStringValue())
			.build());
		SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
			.queueUrl(queueName)
			.messageBody("test")
			.messageAttributes(attributes)
			.build();
		return sendMessageRequest;
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
	public void scheduleNotification(Long vaId, Elderly elderly, Volunteer volunteer, String userType) {
		log.info("reservation Message Scheduled");
		String fcmToken = userType.equals("elderly") ? elderly.getFcmToken() : volunteer.getFcmToken();
		String otherUserName = userType.equals("elderly") ? volunteer.getName() : elderly.getName();
		Long userId = userType.equals("elderly") ? elderly.getId() : volunteer.getId();

		volunteerActivityRepository.findById(vaId).ifPresentOrElse(
			va -> {
				// 예정되어 있던 봉사가 취소되어 매칭 상태인 경우
				if(va.getStatus().equals(MATCHING)) return ;
				// 봉사자가 취소해서 없거나, 다른 봉사자가 매칭되어 있을 때
				if(va.getVolunteer() == null || !va.getVolunteer().getId().equals(userId)) return ;
				sendNotification(makeNotification(fcmToken, "봉사 시작까지 얼마남지 않았아요!", otherUserName + "님과의 봉사 한 시간 전입니다"));
				notificationRedisService.scheduleNotificationInRedis(userId, userType, otherUserName);
			},
			() -> {
				// 알림 예정되어 있던 봉사가 취소된 경우
			}
		);
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
	public void setSchedulingMessageWithTaskScheduler(VolunteerActivity va, Elderly elderly, Volunteer volunteer, String userType) {
		LocalDateTime time = va.getStartTime();
		// 봉사까지 1시간도 안남았으면 즉시 전송
		if(Duration.between(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime(), time).getSeconds() <= 3600L){
			scheduleNotification(va.getId(), elderly, volunteer, userType);
			return ;
		}
		Date executionTime = Date.from(time.minusHours(1).atZone(ZoneId.systemDefault()).toInstant());
		// TODO : cloud 환경에서 실제로 1시간 전에 알림이 가는지 확인
		taskScheduler.schedule(() -> scheduleNotification(va.getId(), elderly, volunteer, userType), executionTime);
	}

}
