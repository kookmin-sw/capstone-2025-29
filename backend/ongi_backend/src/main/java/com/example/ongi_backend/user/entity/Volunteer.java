package com.example.ongi_backend.user.entity;

import java.util.ArrayList;
import java.util.List;

import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.weeklyAvailableTime.entity.WeeklyAvailableTime;

import jakarta.persistence.CascadeType;
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
	@OneToMany(mappedBy = "volunteer", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<WeeklyAvailableTime> weeklyAvailableTimes = new ArrayList<>();
	private Integer volunteerCategory;
	private String bio;
	public void addWeeklyAvailableTime(List<WeeklyAvailableTime> weeklyAvailableTime) {
		weeklyAvailableTimes.clear();
		weeklyAvailableTimes.addAll(weeklyAvailableTime);
	}
	public void updateCategory(Integer category) {
		this.volunteerCategory = category;
	}
	public void updateBio(String bio) {
		this.bio = bio;
	}
	protected Volunteer() {
		super();
	}
}
