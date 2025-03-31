package com.example.ongi_backend.user.Service;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;
import static com.example.ongi_backend.global.exception.ErrorCode.*;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.entity.VolunteerType;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.redis.dto.UnMatching;
import com.example.ongi_backend.global.redis.repository.UnMatchingRepository;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.dto.RequestMatching;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.volunteerActivity.service.VolunteerActivityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ElderlyService {
	private final ElderlyRepository elderlyRepository;
	private final VolunteerRepository volunteerRepository;
	private final VolunteerActivityService volunteerActivityService;
	private final UnMatchingRepository unMatchingRepository;

	@Transactional(rollbackFor = Exception.class)
	public void matching(RequestMatching request, String name) {

		if(Duration.between(LocalDateTime.now(), request.getStartTime()).getSeconds() < 0L) {
			throw new CustomException(POST_TIME_ERROR);
		}

		//TODO : 현재 로그인된 노인의 정보를 가져오는 방법이 따로 있으면 수정
		Elderly elderly = elderlyRepository.findByUsername(name)
			.orElseThrow(() -> new CustomException(NOT_FOUND_USER_ERROR));

		VolunteerActivity volunteerActivity = volunteerActivityService.addVolunteerActivity(request, elderly);

		// 매칭 가능한 봉사자 찾기
		DayOfWeek dayOfWeek = request.getStartTime().getDayOfWeek();
		LocalTime startTime = request.getStartTime().toLocalTime();
		LocalDate date = request.getStartTime().toLocalDate();
		Integer category = VolunteerType.getCategory(request.getVolunteerType());

		Volunteer volunteer = volunteerRepository.findByWeeklyAvailableTime(dayOfWeek, startTime, date, category)
			.orElseGet(() -> {
				// TODO : 매칭 안됨 알림 기능 추가
				unMatchingRepository.save(UnMatching.builder()
						.id(volunteerActivity.getId())
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
				// TODO : return null 말고 다른 방법이 있는지?
				return null;
			});
		if(volunteer != null) {
			// TODO : 매칭 완료 알림 기능 추가
			volunteerActivity.updateStatus(PROGRESS);
			volunteerActivity.updateVolunteer(volunteer);
		}
	}
}
