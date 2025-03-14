package com.example.ongi_backend.user.entity;

import java.util.ArrayList;
import java.util.List;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.Gender;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;

@Entity
@Getter
public class Volunteer extends BaseUser {
	@OneToMany(mappedBy = "volunteer")
	private List<VolunteerActivity> volunteerActivities = new ArrayList<>();

	public Volunteer(String username, String password, String name, int age, Gender gender, String phone, Address address, String profileImage, String phoneCode) {
		super(username, password, name, age, gender, phone, address, profileImage, phoneCode);
	}

	protected Volunteer() {
		super();
	}
}
