package com.example.ongi_backend.volunteerActivity.dto;

import java.time.LocalDateTime;

import com.example.ongi_backend.global.annotation.ValidEnum;
import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.AnimalType;
import com.example.ongi_backend.global.entity.VolunteerType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RequestMatching {
	@Schema(description = "봉사 유형", example = "HEALTH")
	@ValidEnum(enumClass = VolunteerType.class)
	private VolunteerType volunteerType;
	@Schema(description = "추가 요청 사항", example = "나갈 때 쓰레기 버려주세요")
	@NotBlank
	private String addDescription;
	private LocalDateTime startTime;
	@Schema(description = "독거노인 애완동물 여부", example = "dog")
	@ValidEnum(enumClass = AnimalType.class)
	private AnimalType animalType;
	@Schema(description = "봉사자 주소")
	@Valid
	private Address address;
}
