package com.example.ongi_backend.volunteerActivity.entity;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.FetchType.*;
import static jakarta.persistence.GenerationType.*;

import java.time.LocalDateTime;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.AnimalType;
import com.example.ongi_backend.global.entity.BaseEntity;
import com.example.ongi_backend.global.entity.VolunteerStatus;
import com.example.ongi_backend.global.entity.VolunteerType;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.Volunteer;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;

@Entity
@Getter
public class VolunteerActivity extends BaseEntity {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "elderly_id")
	private Elderly elderly;
	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "volunteer_id")
	private Volunteer volunteer;
	@Enumerated(STRING)
	private VolunteerType type;
	private String addDescription;
	private LocalDateTime startTime;
	@Enumerated(STRING)
	private AnimalType animalType;
	@Enumerated(STRING)
	private VolunteerStatus status;
	@Embedded
	private Address address;
}
