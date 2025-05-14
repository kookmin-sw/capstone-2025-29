package com.example.ongi_backend.Security;

import com.example.ongi_backend.Security.Jwt.JwtProvider;
import com.example.ongi_backend.global.exception.ErrorCode;
import com.example.ongi_backend.user.Dto.UserLoginResponseDto;
import com.example.ongi_backend.user.entity.BaseUser;
import com.example.ongi_backend.user.entity.PrincipalDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@AllArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    private final JwtProvider jwtProvider;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = obtainUsername(request);
        String password = obtainPassword(request);
        String userType = request.getParameter("userType");

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(username, password, null);

        request.setAttribute("userType", userType);
        setDetails(request, usernamePasswordAuthenticationToken);

        return this.getAuthenticationManager().authenticate(usernamePasswordAuthenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();
        BaseUser baseUser = principalDetails.getBaseUser();

        String accessToken = jwtProvider.createAccessToken(baseUser.getUsername());
        String refreshToken = jwtProvider.createRefreshToken(baseUser.getUsername());

        UserLoginResponseDto userLoginResponseDto = UserLoginResponseDto.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .userType(baseUser.getClass().getSimpleName())
                        .name(baseUser.getName())
                        .profileImage(baseUser.getProfileImage())
                        .phone(baseUser.getPhone())
                        .address(baseUser.getAddress())
                        .build();

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(userLoginResponseDto);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write(jsonResponse);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.sendError(401, ErrorCode.CREDENTIALS_NOT_MATCHED_ERROR.getMessage());
    }
}
