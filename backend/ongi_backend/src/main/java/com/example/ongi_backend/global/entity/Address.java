package com.example.ongi_backend.global.entity;

import static jakarta.persistence.EnumType.*;
import static lombok.AccessLevel.*;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@Embeddable
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class Address {
	@Enumerated(STRING)
	private DistrictType district;
	private String detail;
}
