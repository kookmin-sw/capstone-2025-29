package com.example.ongi_backend.user.Dto;

import static lombok.AccessLevel.*;

import java.util.List;

import com.example.ongi_backend.global.entity.CurrentMatching;
import com.example.ongi_backend.global.entity.Schedules;
import com.example.ongi_backend.global.entity.VolunteerInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class ResponseVolunteerMainPage {
	private VolunteerInfo volunteerInfo;
	private List<Schedules> availableTimes;
	private CurrentMatching currentMatching;
	public static ResponseVolunteerMainPage of(VolunteerInfo volunteerInfo, List<Schedules> availableTimes, CurrentMatching currentMatching) {
		return ResponseVolunteerMainPage.builder()
			.volunteerInfo(volunteerInfo)
			.availableTimes(availableTimes)
			.currentMatching(currentMatching)
			.build();
	}
}
