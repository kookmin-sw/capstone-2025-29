package com.example.ongi_backend.global.aws.controller;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.ongi_backend.global.aws.AwsSqsNotificationSender;
import com.example.ongi_backend.global.aws.NotificationSender;
import com.example.ongi_backend.global.aws.dto.SqsMessage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TestController {
	private final NotificationSender notificationSender;
	private final AwsSqsNotificationSender awsSqsNotificationSender;
	@GetMapping("/test")
	public String test(@RequestBody SqsMessage message) {
		System.out.println("message = " + message);
		notificationSender.sendNotification(message);
		SqsMessage.builder().messageBody("test").messageAttributes(
				SqsMessage.MessageAttributes.builder()
				.title(SqsMessage.MessageAttribute.builder().dataType("String").stringValue("title").build())
				.body(SqsMessage.MessageAttribute.builder().dataType("String").stringValue("body").build())
				.token(SqsMessage.MessageAttribute.builder().dataType("String").stringValue("token").build())
				.build()
		).build();
		return "test";
	}

	@GetMapping("/test2")
	public ResponseEntity<?> taskSchedulerTest() {
		awsSqsNotificationSender.testTaskScheduler(
			LocalDateTime.now().plusSeconds(90)
		);
		return ResponseEntity.ok().build();
	}
}
