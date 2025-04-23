package com.example.ongi_backend.user.Dto;

import java.util.List;

import org.hibernate.validator.constraints.Range;

import com.example.ongi_backend.global.entity.Schedules;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ScheduleRequest {
	private List<Schedules> schedules;
	@Range(min = 1, max = 15)
	@Schema(description = "봉사 카테고리 (1~15 사이의 값)"
		+ "\tHEALTH(1),\n"
		+ "\tHOUSING(2),\n"
		+ "\tCULTURE(4),\n"
		+ "\tEDUCATION(8),", minimum = "1", maximum = "15", example = "1")
	@NotNull
	private int category;
}
