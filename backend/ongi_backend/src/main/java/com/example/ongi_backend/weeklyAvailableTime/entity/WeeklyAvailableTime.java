package com.example.ongi_backend.weeklyAvailableTime.entity;

import static jakarta.persistence.GenerationType.*;

import java.sql.Time;
import java.time.DayOfWeek;

import com.example.ongi_backend.user.entity.Volunteer;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class WeeklyAvailableTime {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "volunteer_id")
	private Volunteer volunteer;

	private DayOfWeek dayOfWeek;
	private Time availableStartTime;

	//TODO : figma 보니까 끝나는 시간은 따로 명시 안하는거 같아서 삭제해도 될듯
	private Time availableEndTime;
}
