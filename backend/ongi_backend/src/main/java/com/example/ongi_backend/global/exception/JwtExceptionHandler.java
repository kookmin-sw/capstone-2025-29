package com.example.ongi_backend.global.exception;

import static java.time.LocalDateTime.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class JwtExceptionHandler {

	@ExceptionHandler({SignatureException.class, MalformedJwtException.class, StringIndexOutOfBoundsException.class})
	public ResponseEntity<ErrorResponse> JwtInvalidException() {
		ErrorCode errorCode = ErrorCode.INVALID_TOKEN_ERROR;
		return ResponseEntity.status(errorCode.getStatus()).body(makeErrorResponse(errorCode));
	}

	@ExceptionHandler(ExpiredJwtException.class)
	public ResponseEntity<ErrorResponse> JwtExpiredException() {
		ErrorCode errorCode = ErrorCode.EXPIRED_TOKEN_ERROR;
		return ResponseEntity.status(errorCode.getStatus()).body(makeErrorResponse(errorCode));
	}

	// TODO : 모든 NPE가 token이 없다고 잡아내고 있음
	// @ExceptionHandler({NullPointerException.class})
	// public ResponseEntity<ErrorResponse> JwtNullPointerException() {
	// 	ErrorCode errorCode = ErrorCode.NULL_TOKEN_ERROR;
	// 	return ResponseEntity.status(errorCode.getStatus()).body(makeErrorResponse(errorCode));
	// }

	private ErrorResponse makeErrorResponse(ErrorCode errorCode) {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		return ErrorResponse.builder()
			.timeStamp(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime())
			.status(errorCode.getStatus())
			.error(errorCode.getCode())
			.message(errorCode.getMessage())
			.path(request.getRequestURI())
			.build();
	}

}
