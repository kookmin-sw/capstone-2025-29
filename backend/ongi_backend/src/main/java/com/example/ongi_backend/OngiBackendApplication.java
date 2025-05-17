package com.example.ongi_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class OngiBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OngiBackendApplication.class, args);
	}

}
