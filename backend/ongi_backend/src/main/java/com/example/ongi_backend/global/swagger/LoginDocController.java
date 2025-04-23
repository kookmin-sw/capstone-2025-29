package com.example.ongi_backend.global.swagger;

import com.example.ongi_backend.user.Dto.UserLoginResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginDocController {
    @Operation(summary = "로그인", description = "username, password, userType을 입력하면 JWT 토큰 반환")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공", content = @Content(schema = @Schema(implementation = UserLoginResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "로그인 실패")
    })
    @PostMapping("/login")
    public void login(
            @Parameter(description = "아이디") @RequestParam String username,
            @Parameter(description = "비밀번호") @RequestParam String password,
            @Parameter(description = "사용자 타입") @RequestParam String userType
    ) {
        // 여긴 호출되지 않음
    }
}
