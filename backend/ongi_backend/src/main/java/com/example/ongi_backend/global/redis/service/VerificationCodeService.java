package com.example.ongi_backend.global.redis.service;

import com.example.ongi_backend.global.aws.AwsSnsVerificationCodeSender;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.exception.ErrorCode;
import com.example.ongi_backend.global.redis.dto.VerificationCode;
import com.example.ongi_backend.global.redis.repository.VerificationCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class VerificationCodeService {
    private final AwsSnsVerificationCodeSender awsSnsVerificationCodeSender;
    private final VerificationCodeRepository verificationCodeRepository;

    public void sendVerificationCode(String phoneNumber) {
        String verificationCode = awsSnsVerificationCodeSender.sendVerificationCode(phoneNumber);
        verificationCodeRepository.save(VerificationCode.builder()
                .verificationCode(verificationCode)
                .phone(phoneNumber)
                .ttl(300L)
                .build());
    }

    public void verifyVerificationCode(String phoneNumber, String verificationCode) {
        VerificationCode savedVerificationCode = verificationCodeRepository.findById(phoneNumber).orElseThrow(
                () -> new CustomException(ErrorCode.CERTIFICATION_NUMBER_NOT_FOUND_ERROR)
        );

        if (!verificationCode.equals(savedVerificationCode.getVerificationCode()))
            throw new CustomException(ErrorCode.CERTIFICATION_NUMBER_NOT_MATCH_ERROR);

        verificationCodeRepository.delete(savedVerificationCode);
    }
}
