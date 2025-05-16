package com.example.ongi_backend.global.entity;

import java.time.DayOfWeek;
import java.time.LocalTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "요일별 봉사 가능 시간")
public class Schedules {
	@Schema(description = "요일", example = "MONDAY")
	private DayOfWeek dayOfWeek;
	private LocalTime time;

	public static Schedules of(DayOfWeek dayOfWeek, LocalTime time) {
		return Schedules.builder()
			.dayOfWeek(dayOfWeek)
			.time(time)
			.build();
	}
}
