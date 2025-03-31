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

	@Transactional
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

		volunteerRepository.findByWeeklyAvailableTime(dayOfWeek, startTime, date, category, request.getAddress()
			.getDistrict()).ifPresentOrElse(
			volunteer -> {
				// TODO : 매칭 알림 추가
				volunteerActivity.updateStatus(PROGRESS);
				volunteerActivity.updateVolunteer(volunteer);
			},
			() -> {
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
			});
	}

	@Transactional
	public void cancelMatching(Long id, String username) {
		// TODO : 중복되는 기능은 따로 메소드로 분리
		VolunteerActivity findVolunteerActivity = volunteerActivityService.findById(id);
		Elderly elderly = elderlyRepository.findByUsername(username).orElseThrow(
			() -> new CustomException(NOT_FOUND_USER_ERROR)
		);
		if(!findVolunteerActivity.getElderly().equals(elderly)) {
			throw new CustomException(ACCESS_DENIED_ERROR);
		}
		if(findVolunteerActivity.getStatus().equals(PROGRESS)) {
			volunteerActivityService.deleteActivity(id);
		} else if (findVolunteerActivity.getStatus().equals(MATCHING)) {
			// TODO : 봉사자에게 취소 알림 전송
			volunteerActivityService.deleteActivity(id);
			unMatchingRepository.deleteById(id);
		}else{
			throw new CustomException(UNAVAILABLE_CANCLE_VOLUNTEER_ACTIVITY_ERROR);
		}
	}
}
