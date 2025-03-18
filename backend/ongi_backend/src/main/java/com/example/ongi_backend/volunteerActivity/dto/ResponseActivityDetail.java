package com.example.ongi_backend.volunteerActivity.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.AnimalType;
import com.example.ongi_backend.global.entity.VolunteerType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class ResponseActivityDetail {
	private Long id;
	private VolunteerType type;
	private LocalDateTime startTime;
	private AnimalType animalType;
	private String addDescription;
	private Address address;
}
