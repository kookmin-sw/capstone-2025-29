package com.example.ongi_backend.global.exception;

import static java.time.LocalDateTime.*;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(CustomException.class)
	public ResponseEntity<ErrorResponse> globalException(CustomException e) {
		log.info("exception 발생");
		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();
		ErrorResponse response = ErrorResponse.builder()
			.timeStamp(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime())
			.status(e.getErrorCode().getStatus())
			.error(e.getErrorCode().getCode())
			.message(e.getMessage())
			.path(request.getRequestURI())
			.build();
		return ResponseEntity.status(e.getErrorCode().getStatus()).body(response);
	}
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> methodArgumentNotValidException(MethodArgumentNotValidException e) {
		log.info("exception 발생");
		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();
		ErrorResponse response = ErrorResponse.builder()
			.timeStamp(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime())
			.status(400)
			.error("BAD_REQUEST")
			.message(e.getBindingResult().getFieldError().getDefaultMessage())
			.path(request.getRequestURI())
			.build();
		return ResponseEntity.badRequest().body(response);
	}
}
