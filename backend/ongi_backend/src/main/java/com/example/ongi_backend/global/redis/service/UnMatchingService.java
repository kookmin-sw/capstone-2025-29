package com.example.ongi_backend.global.redis.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.entity.Address;
import com.example.ongi_backend.global.entity.AnimalType;
import com.example.ongi_backend.global.entity.VolunteerType;
import com.example.ongi_backend.global.redis.dto.UnMatching;
import com.example.ongi_backend.global.redis.repository.UnMatchingRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UnMatchingService {
	private final UnMatchingRepository unMatchingRepository;
	@Transactional
	public void saveUnMatching(Long vId, Long eId, VolunteerType volunteerType, LocalDateTime startTime, AnimalType animalType, Address address, String addDescription) {
		unMatchingRepository.save(UnMatching.builder()
			.id(vId)
			.elderlyId(eId)
			.volunteerType(volunteerType)
			.startTime(startTime)
			.animalType(animalType)
			.address(address)
			.addDescription(addDescription)
			.ttl(
				Duration.between(LocalDateTime.now(), startTime).getSeconds()
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
