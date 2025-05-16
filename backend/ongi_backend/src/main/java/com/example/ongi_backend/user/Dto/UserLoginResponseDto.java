package com.example.ongi_backend.user.Dto;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.Gender;
import jakarta.persistence.Embedded;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;

import static jakarta.persistence.EnumType.STRING;

@Getter
@Builder
public class UserLoginResponseDto {
    String accessToken;
    String refreshToken;
    String userType;
    String name;
    String phone;
    Address address;
    String profileImage;
}
