package com.example.ongi_backend.volunteerActivity.dto;

import java.time.LocalDateTime;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.AnimalType;
import com.example.ongi_backend.global.entity.VolunteerType;

import lombok.Data;

@Data
public class RequestMatching {
	private VolunteerType volunteerType;
	private String addDescription;
	private LocalDateTime startTime;
	private AnimalType animalType;
	private Address address;
}
