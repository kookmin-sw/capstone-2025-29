package com.example.ongi_backend.global;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
	@GetMapping("/healthCheck")
	public String healthCheck() {
		return "OK";
	}
}
