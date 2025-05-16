package com.example.ongi_backend.global.aws;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;

import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class AwsSnsVerificationCodeSender {
    private final SnsClient snsClient;

    public String sendVerificationCode(String phoneNumber) {
        String verificationCode = generateRandomCode();
        String message = String.format("[ONGI] 인증번호[%s]를 입력해주세요.", verificationCode);

        PublishRequest request = PublishRequest.builder()
                .message(message)
                .phoneNumber(phoneNumber)
                .build();

        try {
            snsClient.publish(request);
        } catch (Exception e) {
            log.error("send verification code error : ", e);
        }
        return verificationCode;
    }

    private String generateRandomCode() {
        Random random = new Random();
        int number = random.nextInt(900000) + 100000;
        return String.valueOf(number);
    }
}
