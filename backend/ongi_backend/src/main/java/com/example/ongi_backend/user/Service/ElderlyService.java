package com.example.ongi_backend.user.Service;

import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.redis.dto.UnMatching;
import com.example.ongi_backend.global.redis.repository.UnMatchingRepository;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.volunteerActivity.dto.RequestMatching;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ElderlyService {
	private final ElderlyRepository elderlyRepository;
	private final VolunteerService volunteerService;
	private final UnMatchingRepository unMatchingRepository;

	public void matching(RequestMatching request, String name) {
		// TODO : 봉사자 weeklyAvailable 검색 과정 추가. 지금은 검색 안됬다고 가정
		Elderly elderly = elderlyRepository.findByUsername(name)
			.orElseThrow(() -> new CustomException(NOT_FOUND_USER_ERROR));
		unMatchingRepository.save(UnMatching.builder()
			.elderlyId(elderly.getId())
			.volunteerType(request.getVolunteerType())
			.startTime(request.getStartTime())
			.animalType(request.getAnimalType())
			.address(request.getAddress())
			.addDescription(request.getAddDescription())
			.ttl(
				Duration.between(LocalDateTime.now(), request.getStartTime()).getSeconds()
			)
			.build());
		// TODO : 매칭 안됨 알림?


	}
}
