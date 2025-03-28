package com.example.ongi_backend.global.redis.dto;

import static jakarta.persistence.GenerationType.*;
import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.AnimalType;
import com.example.ongi_backend.global.entity.VolunteerType;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@RedisHash("UnMatching")
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
@ToString
@Getter
public class UnMatching {
	@Id
	@GeneratedValue(strategy = UUID)
	private String id;
	private Long elderlyId;
	private VolunteerType volunteerType;
	private String addDescription;
	private LocalDateTime startTime;
	private AnimalType animalType;
	private Address address;
	@TimeToLive
	private Long ttl;
}
