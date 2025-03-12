package com.example.ongi_backend.global.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {
	private String district;
	private String detail;
}
