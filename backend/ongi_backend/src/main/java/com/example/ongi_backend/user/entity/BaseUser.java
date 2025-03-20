package com.example.ongi_backend.user.entity;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.GenerationType.*;

import com.example.ongi_backend.global.entity.Gender;
import com.example.ongi_backend.global.entity.Address;

import jakarta.persistence.Embedded;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@MappedSuperclass
public abstract class BaseUser {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	private String username;
	private String password;
	private String name;
	private int age;
	@Enumerated(STRING)
	private Gender gender;
	private String phone;
	@Embedded
	private Address address;
	private String profileImage;
	private String phoneCode;

	public BaseUser() {

	}
}
