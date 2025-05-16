package com.example.ongi_backend.global.aws;

import com.example.ongi_backend.global.aws.dto.SqsMessage;

public interface NotificationSender {
	void sendNotification(SqsMessage message);
}
