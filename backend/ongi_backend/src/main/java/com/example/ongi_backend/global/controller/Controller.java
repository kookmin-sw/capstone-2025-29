package com.example.ongi_backend.global.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class Controller {
	@GetMapping("/healthCheck")
	public String healthCheck() {
		return "OK";
	}
}
