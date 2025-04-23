package com.example.ongi_backend.review.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RequestResistReview {
	// TODO : 나중에 유효성 조건 정하고 수정하기, 지금은 임의로 설정
	@NotNull(message = "봉사활동 아이디는 필수입니다.")
	@Schema(description = "봉사활동 아이디", example = "1")
	private Long volunteerActivityId;
	@NotNull(message = "리뷰 내용은 필수입니다.")
	@Size(min = 1, max = 100, message = "리뷰 내용은 1자 이상 100자 이하로 작성해주세요.")
	@Schema(description = "리뷰 내용", example = "노인분들이 너무 친절하셨습니다.")
	private String content;
	@NotEmpty(message = "이미지 URL은 필수입니다.")
	@Schema(
		description = "이미지 URL 리스트",
		example = "[\"review/bb0b4359-731e-4cf5-baf0-52251e6b2447\", \"review/bb0b4359-731e-4cf5-baf0-52251e6b2448\"]"
	)
	private List<@NotBlank(message = "이미지 URL은 비어 있을 수 없습니다.") String> imageUrls;

}
