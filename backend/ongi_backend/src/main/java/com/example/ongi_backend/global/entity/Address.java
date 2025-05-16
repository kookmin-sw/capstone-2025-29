package com.example.ongi_backend.global.entity;

import static jakarta.persistence.EnumType.*;
import static lombok.AccessLevel.*;

import com.example.ongi_backend.global.annotation.ValidEnum;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
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
	@ValidEnum(enumClass = DistrictType.class)
	private DistrictType district;
	@Schema(description = "상세 주소", example = "역삼동 123-45")
	@NotBlank
	private String detail;
}
