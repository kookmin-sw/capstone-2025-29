package com.example.ongi_backend.global.redis.dto;


import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@RedisHash("VerificationCode")
@Getter
@Builder
public class VerificationCode {
    @Id
    private String phone;
    private String verificationCode;
    @TimeToLive
    private Long ttl;
}
