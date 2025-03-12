package com.example.ongi_backend.user.entity;

import java.util.ArrayList;
import java.util.List;

import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;

@Entity
@Getter
public class Volunteer extends BaseUser {
	@OneToMany(mappedBy = "volunteer")
	private List<VolunteerActivity> volunteerActivities = new ArrayList<>();
}
