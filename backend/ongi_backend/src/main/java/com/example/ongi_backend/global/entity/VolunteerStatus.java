package com.example.ongi_backend.global.entity;

import lombok.Getter;

@Getter
public enum VolunteerStatus {
	COMPLETED("완료된 봉사"), PROGRESS("진행 중인 봉사"), REVIEWING("후기 작성해야 되는 봉사"), MATCHING("매칭중인 봉사"),STARTED("시작된 봉사"), NOT_STARTED("시작 안된 봉사"), NOT_MATCHING("매칭 안된 봉사"), CANCELED("취소된 봉사"), POSTPONED("연기된 봉사");
	private final String description;

	VolunteerStatus(String description) {
		this.description = description;
	}
}
