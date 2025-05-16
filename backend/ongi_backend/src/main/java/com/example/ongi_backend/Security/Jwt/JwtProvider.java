package com.example.ongi_backend.Security.Jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;

@Component
public class JwtProvider {
    @Value("${secret}")
    private String secretKey;
    private Long accessTokenExp = 86400L * 7 * 4;
    private Long refreshTokenExp = 86400L;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createAccessToken(String username) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject("accessToken")
                .claim("username", username)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + accessTokenExp))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public String createRefreshToken(String username) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject("refreshToken")
                .claim("username", username)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + refreshTokenExp))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public boolean isAccessToken(String token) {
        Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
        return "accessToken".equals(claims.getBody().getSubject());
    }

    public boolean isRefreshToken(String token) {
        Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
        return "refreshToken".equals(claims.getBody().getSubject());
    }

    public String getUser(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .get("username", String.class);
    }

    public String resolveToken(HttpServletRequest request) {
        return request.getHeader("Authorization");
    }

    public boolean validateToken(String token) {
        Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
        return !claims.getBody().getExpiration().before(new Date());
    }

    public boolean checkBearerToken(String token) {
        return token.substring(0, "BEARER ".length()).equalsIgnoreCase("BEARER ");
    }

    public String disassembleToken(String token) {
        token = token.split(" ")[1].trim();
        return token;
    }
}
