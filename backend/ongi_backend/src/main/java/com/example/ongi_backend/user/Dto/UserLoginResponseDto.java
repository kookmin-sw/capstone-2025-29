package com.example.ongi_backend.user.Dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserLoginResponseDto {
    String accessToken;
    String refreshToken;
    String userType;
}
