package com.example.ongi_backend.Security.oauth;

import lombok.Builder;

import java.util.Map;

@Builder
public class KakaoUserInfo {
    private Map<String, Object> attributes;

    public String getUsername() {
        return (String) attributes.get("email");
    }
    public String getName() {
        return (String) attributes.get("name");
    }
    public String getGender() {
        return (String) attributes.get("gender");
    }
    public String getBirthday() {
        return (String) attributes.get("birthday");
    }
    public String getBirthyear() {
        return (String) attributes.get("birthyear");
    }
    public String getPhoneNumber() {
        return (String) attributes.get("phone_number");
    }
}
