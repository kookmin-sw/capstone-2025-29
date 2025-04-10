package com.example.ongi_backend.review.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RequestResistReview {
	// TODO : 나중에 유효성 조건 정하고 수정하기, 지금은 임의로 설정
	@NotNull(message = "봉사활동 아이디는 필수입니다.")
	private Long volunteerActivityId;
	@NotNull(message = "리뷰 내용은 필수입니다.")
	@Size(min = 1, max = 100, message = "리뷰 내용은 1자 이상 100자 이하로 작성해주세요.")
	private String content;
	@NotEmpty(message = "이미지 URL은 필수입니다.")
	private List<@NotBlank(message = "이미지 URL은 비어 있을 수 없습니다.") String> imageUrls;
}
