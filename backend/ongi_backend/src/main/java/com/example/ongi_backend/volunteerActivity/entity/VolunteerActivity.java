package com.example.ongi_backend.volunteerActivity.entity;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.FetchType.*;
import static jakarta.persistence.GenerationType.*;
import static lombok.AccessLevel.*;

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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
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
	// TODO : 날짜로 index를 사용하면 성능이 좋아질 것 같음, 나중에 테스트 해보고 성능이 좋으면 변경
	private LocalDateTime startTime;
	@Enumerated(STRING)
	private AnimalType animalType;
	@Enumerated(STRING)
	private VolunteerStatus status;
	@Embedded
	private Address address;

	public void updateStatus(VolunteerStatus status) {
		this.status = status;
	}

	public void updateVolunteer(Volunteer volunteer) {
		this.volunteer = volunteer;
	}
}
