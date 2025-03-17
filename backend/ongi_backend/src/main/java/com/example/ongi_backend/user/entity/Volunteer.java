package com.example.ongi_backend.user.entity;

import java.util.ArrayList;
import java.util.List;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.Gender;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@SuperBuilder
public class Volunteer extends BaseUser {
	@OneToMany(mappedBy = "volunteer")
	private List<VolunteerActivity> volunteerActivities = new ArrayList<>();

	protected Volunteer() {
		super();
	}
}
