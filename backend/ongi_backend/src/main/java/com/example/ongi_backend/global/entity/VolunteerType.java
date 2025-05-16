package com.example.ongi_backend.global.entity;

import lombok.Getter;

@Getter
public enum VolunteerType {
	//TODO: 종류가 뭐 있는지 몰라서 나중에 추가하는걸로
	HEALTH(1),
	HOUSING(2),
	CULTURE(4),
	EDUCATION(8),
	;
	private final Integer category;
	VolunteerType(int category) {
		this.category = category;
	}
	public static Integer getCategory(VolunteerType volunteerType) {
		return volunteerType.category;
	}
}
