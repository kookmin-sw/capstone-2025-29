package com.example.ongi_backend.user.Dto;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.Gender;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseUserInfo {
    private String name;
    private int age;
    private Gender gender;
    private String phone;
    private Address address;
    private String profileImage;
}
