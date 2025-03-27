package com.example.ongi_backend.user.Dto;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

import lombok.Data;

@Data
public class ScheduleRequest {
	private List<Schedules> schedules;
	@Data
	public static class Schedules {
		private DayOfWeek dayOfWeek;
		private LocalTime time;
	}
}
