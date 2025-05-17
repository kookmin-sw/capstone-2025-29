package com.example.ongi_backend.user.Dto;

import lombok.Getter;

@Getter
public class RequestModifyFcmToken {
    private String fcmToken;
    private String userType;
}
