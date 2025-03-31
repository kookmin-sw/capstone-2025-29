package com.example.ongi_backend.global.entity;

import lombok.Getter;

@Getter
public enum VolunteerStatus {
	COMPLETED("완료된 봉사"), PROGRESS("진행 중인 봉사"), REVIEWING("후기 작성해야 되는 봉사"), MATCHING("매칭중인 봉사"),;
	private final String description;

	VolunteerStatus(String description) {
		this.description = description;
	}
}
