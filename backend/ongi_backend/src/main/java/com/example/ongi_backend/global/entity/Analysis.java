package com.example.ongi_backend.global.entity;

import lombok.Getter;

@Getter
public enum Analysis {
	JOY("기쁨"), EXCITEMENT("신남"), SAD("슬픔"),
	ANGER("분노"), CALM("평온"), LONELINESS("외로움"), FEAR("두려움");

	Analysis(String description) {
		this.description = description;
	}

	private final String description;
}
