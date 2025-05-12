package com.example.ongi_backend.user.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class RequestVerificationCode {
    @Schema(
            description = "전화번호는 +82로 시작하는 국제 형식",
            example = "+821012345678"
    )
    @Pattern(regexp = "^\\+82[0-9]{9,10}$", message = "전화번호는 +82로 시작하는 형식이어야 합니다.")
    private String phoneNumber;
}
