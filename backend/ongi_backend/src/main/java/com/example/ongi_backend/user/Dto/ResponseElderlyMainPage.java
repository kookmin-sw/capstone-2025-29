package com.example.ongi_backend.user.Dto;

import static lombok.AccessLevel.*;

import com.example.ongi_backend.global.entity.CurrentMatching;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class ResponseElderlyMainPage {
	private CurrentMatching currentMatching;
	public static ResponseElderlyMainPage of(CurrentMatching currentMatching) {
		return ResponseElderlyMainPage.builder()
			.currentMatching(currentMatching)
			.build();
	}
}
