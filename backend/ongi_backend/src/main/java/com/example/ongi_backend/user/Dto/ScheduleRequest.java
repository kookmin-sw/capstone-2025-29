package com.example.ongi_backend.user.Dto;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

import org.hibernate.validator.constraints.Range;

import lombok.Data;

@Data
public class ScheduleRequest {
	private List<Schedules> schedules;
	@Range(min = 1, max = 15)
	private int category;
	@Data
	public static class Schedules {
		private DayOfWeek dayOfWeek;
		private LocalTime time;
	}
}
