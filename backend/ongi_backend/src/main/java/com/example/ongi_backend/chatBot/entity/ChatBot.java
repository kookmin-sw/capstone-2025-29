package com.example.ongi_backend.chatBot.entity;

import static jakarta.persistence.GenerationType.*;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class ChatBot {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;

	private String name;
	private String profileImage;
}
