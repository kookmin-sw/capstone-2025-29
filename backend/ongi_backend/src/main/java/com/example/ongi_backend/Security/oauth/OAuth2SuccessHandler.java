package com.example.ongi_backend.Security.oauth;

import com.example.ongi_backend.Security.Jwt.JwtProvider;
import com.example.ongi_backend.user.entity.BaseUser;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.PrincipalDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        BaseUser user = principalDetails.getBaseUser();

        // 1. TemporaryUser라면 → 회원가입 창으로 리다이렉트
        if (user instanceof TemporaryUser) {
            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:8080/front/signup") // 리다이렉트 링크 수정 예정
                    .queryParam("isNewUser", true) // 데이터베이스에 유저 정보가 존재하는지? (새로운 유저인지 판단)
                    .queryParam("username", user.getUsername())
                    .queryParam("name", user.getName())
                    .queryParam("gender", user.getGender())
                    .queryParam("phone", user.getPhone())
                    .queryParam("age", user.getAge())
                    .encode()
                    .build().toUriString();

            response.sendRedirect(redirectUrl);
            return;
        }

        // 2. 기존 사용자라면 → JWT 발급 및 전달
        String accessToken = jwtProvider.createAccessToken(user.getUsername());
        String refreshToken = jwtProvider.createRefreshToken(user.getUsername());

        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:8080/front/login/success")
                .queryParam("isNewUser", false)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("userType", user instanceof Elderly ? "elderly" : "volunteer")
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }
}
