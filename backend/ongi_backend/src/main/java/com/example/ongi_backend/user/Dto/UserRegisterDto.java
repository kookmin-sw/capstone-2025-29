package com.example.ongi_backend.user.Dto;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.Gender;
import lombok.Getter;

@Getter
public class UserRegisterDto {
    private String username;
    private String password;
    private String name;
    private int age;
    private Gender gender;
    private String phone;
    private Address address;
    private String phoneCode;
    private String userType;
    private String bio;
}
