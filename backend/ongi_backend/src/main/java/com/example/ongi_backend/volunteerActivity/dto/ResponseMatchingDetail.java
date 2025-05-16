package com.example.ongi_backend.volunteerActivity.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.AnimalType;
import com.example.ongi_backend.global.entity.VolunteerType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class ResponseMatchingDetail {
	@Schema(description = "봉사 매칭 ID", example = "1")
	private Long id;
	@Schema(description = "봉사 타입", example = "HOUSING")
	private VolunteerType type;
	private LocalDateTime startTime;
	@Schema(description = "노인 애완 동물 여부", example = "none")
	private AnimalType animalType;
	@Schema(description = "추가 요청 사항", example = "빨리 와주세요")
	private String addDescription;
	private Address address;
	@Schema(description = "독거 노인 이름", example = "홍길동")
	private String elderlyName;

}
