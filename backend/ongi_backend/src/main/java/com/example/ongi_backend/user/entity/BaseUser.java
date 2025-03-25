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
import lombok.experimental.SuperBuilder;

import java.util.Optional;

@Getter
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

	public void updateInfo(String name, int age, Gender gender, String phone,
						   Address address, String password, String profileImage) {
		Optional.ofNullable(name).ifPresent(updatedName -> this.name = updatedName);
		if (age > 0) this.age = age;
		Optional.ofNullable(gender).ifPresent(updatedGender -> this.gender = updatedGender);
		Optional.ofNullable(phone).ifPresent(updatedPhone -> this.phone = updatedPhone);
		Optional.ofNullable(address).ifPresent(updatedAddress -> this.address = updatedAddress);
		Optional.ofNullable(password).ifPresent(updatedPassword -> this.password = updatedPassword);
		Optional.ofNullable(profileImage).ifPresent(updatedProfile -> this.profileImage = updatedProfile);
	}

	public void updatePassword(String password) {
		Optional.ofNullable(password).ifPresent(updatedPassword -> this.password = updatedPassword);
	}
}
