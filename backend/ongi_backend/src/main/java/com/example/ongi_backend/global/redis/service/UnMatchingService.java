package com.example.ongi_backend.global.redis.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.redis.dto.UnMatching;
import com.example.ongi_backend.global.redis.repository.UnMatchingRepository;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UnMatchingService {
	private final UnMatchingRepository unMatchingRepository;
	@Transactional
	public void saveUnMatching(Long vId, Long eId, VolunteerActivity volunteerActivity) {
		unMatchingRepository.save(UnMatching.builder()
			.id(vId)
			.elderlyId(eId)
			.volunteerType(volunteerActivity.getType())
			.startTime(volunteerActivity.getStartTime())
			.animalType(volunteerActivity.getAnimalType())
			.address(volunteerActivity.getAddress())
			.addDescription(volunteerActivity.getAddDescription())
			.ttl(
				Duration.between(LocalDateTime.now(), volunteerActivity.getStartTime()).getSeconds()
			)
			.build());
	}

	@Transactional
	public void deleteUnMatching(UnMatching unMatching) {
		unMatchingRepository.delete(unMatching);
	}

	@Transactional
	public void deleteUnMatchingById(Long id) {
		unMatchingRepository.deleteById(id);
	}

	public List<UnMatching> findAllUnMatching() {
		return unMatchingRepository.findAll();
	}
}
