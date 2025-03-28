package com.example.ongi_backend.global.entity;

import static jakarta.persistence.EnumType.*;
import static lombok.AccessLevel.*;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@Embeddable
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
@ToString
public class Address {
	@Enumerated(STRING)
	private DistrictType district;
	private String detail;
}
