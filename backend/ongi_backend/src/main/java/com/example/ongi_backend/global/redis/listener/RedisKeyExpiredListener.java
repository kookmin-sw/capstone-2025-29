package com.example.ongi_backend.global.redis.listener;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;

import com.example.ongi_backend.global.aws.AwsSqsNotificationSender;
import com.example.ongi_backend.volunteerActivity.service.VolunteerActivityService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RedisKeyExpiredListener extends KeyExpirationEventMessageListener {
	/**
	 * Creates new {@link MessageListener} for {@code __keyevent@*__:expired} messages.
	 *
	 * @param listenerContainer must not be {@literal null}.
	 */
	private final VolunteerActivityService volunteerActivityService;
	private final AwsSqsNotificationSender awsSqsNotificationSender;
	public RedisKeyExpiredListener(RedisMessageListenerContainer listenerContainer,
		VolunteerActivityService volunteerActivityService, AwsSqsNotificationSender awsSqsNotificationSender) {
		super(listenerContainer);
		this.volunteerActivityService = volunteerActivityService;
		this.awsSqsNotificationSender = awsSqsNotificationSender;
	}

	@Override
	public void onMessage(Message message, byte[] pattern) {
		log.info("###### onMessage pattern " + new String(pattern) + " | " + message.toString());
		String key = message.toString();
		if(key.contains("UnMatching")){
			Long id = Long.valueOf(key.split(":")[1]);
			volunteerActivityService.expireActivity(id);
		}
	}
}
