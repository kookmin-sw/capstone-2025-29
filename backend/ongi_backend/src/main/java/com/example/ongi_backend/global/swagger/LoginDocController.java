package com.example.ongi_backend.global.swagger;

import com.example.ongi_backend.user.Dto.UserLoginResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.GetMapping;
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
    @PostMapping("/api/login")
    public void login(
            @Parameter(description = "아이디") @RequestParam String username,
            @Parameter(description = "비밀번호") @RequestParam String password,
            @Parameter(description = "사용자 타입") @RequestParam String userType
    ) {
    }

    @Operation(summary = "카카오 로그인", description = "isNewUser에 따라 반환값 달라짐")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "로그인 성공, 기존 사용자일 경우 JWT 발급. responseCode : 301  쿼리 파라미터: " +
                            "isNewUser=false, accessToken=<access_token>, refreshToken=<refresh_token>, userType=<user_type>",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = String.class)),
                    headers = {
                            @Header(name = "Location", description = "기존 사용자일 경우 JWT 발급 후 리다이렉트")
                    }

            ),
            @ApiResponse(
                    responseCode = "301",
                    description = "새로운 사용자일 경우 회원가입 페이지로 리다이렉트. 쿼리 파라미터: " +
                            "isNewUser=true, username=<username>, name=<name>, gender=<gender>, phone=<phone>, age=<age>",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = String.class)),
                    headers = {
                            @Header(name = "Location", description = "새로운 사용자일 경우 회원가입 페이지로 리다이렉트=")
                    }
            ),
            @ApiResponse(responseCode = "401", description = "로그인 실패")
    })
    @GetMapping("/oauth2/authorization/kakao")
    public void kakaoLogin() {
    }

}
