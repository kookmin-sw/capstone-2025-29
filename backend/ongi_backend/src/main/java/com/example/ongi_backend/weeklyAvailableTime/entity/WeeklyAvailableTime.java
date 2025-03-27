package com.example.ongi_backend.weeklyAvailableTime.entity;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.GenerationType.*;
import static lombok.AccessLevel.*;

import java.sql.Time;
import java.time.DayOfWeek;
import java.time.LocalTime;

import com.example.ongi_backend.user.entity.Volunteer;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class WeeklyAvailableTime {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "volunteer_id")
	private Volunteer volunteer;
	@Enumerated(STRING)
	private DayOfWeek dayOfWeek;
	private LocalTime availableStartTime;
	private LocalTime availableEndTime;
}
