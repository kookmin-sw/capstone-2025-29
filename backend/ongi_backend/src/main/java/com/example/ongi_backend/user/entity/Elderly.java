package com.example.ongi_backend.user.entity;

import static jakarta.persistence.FetchType.*;

import java.util.ArrayList;
import java.util.List;

import com.example.ongi_backend.chatBot.entity.ChatBot;
import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.Gender;
import com.example.ongi_backend.sentimentAnalysis.entity.SentimentAnalysis;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.*;
import org.springframework.stereotype.Service;

@Entity
@Getter
public class Elderly extends BaseUser{
	@OneToOne(fetch = LAZY)
	@JoinColumn(name = "chat_bot_id")
	private ChatBot chatBot;

	@OneToMany(mappedBy = "elderly")
	private List<SentimentAnalysis> sentimentAnalysis = new ArrayList<>();
	@OneToMany(mappedBy = "elderly")
	private List<VolunteerActivity> volunteerActivities = new ArrayList<>();

	public Elderly(String username, String password, String name, int age, Gender gender, String phone, Address address, String profileImage, String phoneCode) {
		super(username, password, name, age, gender, phone, address, profileImage, phoneCode);
	}

	public Elderly() {
		super();
	}
}
