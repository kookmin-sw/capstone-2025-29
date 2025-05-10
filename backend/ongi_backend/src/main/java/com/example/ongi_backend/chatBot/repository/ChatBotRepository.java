package com.example.ongi_backend.chatBot.repository;

import com.example.ongi_backend.chatBot.entity.ChatBot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatBotRepository extends JpaRepository<ChatBot, Long> {
}
