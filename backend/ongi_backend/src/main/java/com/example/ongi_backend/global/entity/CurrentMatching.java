package com.example.ongi_backend.global.entity;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;

import java.time.LocalDateTime;

import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@Schema(description = "봉사 진행 여부")
public class CurrentMatching{
	@Schema(description = "매칭 ID", example = "1")
	private Long matchingId;
	@Schema(description = "상대방 이름", example = "홍길동")
	private String otherName;
	@Schema(description = "매칭 상태", example = "REVIEWING")
	private VolunteerStatus status;
	private LocalDateTime startTime;
	public static CurrentMatching VolunteerOf(VolunteerActivity volunteerActivity) {
		return CurrentMatching.builder()
			.matchingId(volunteerActivity.getId())
			.otherName(
				volunteerActivity.getElderly().getName()
			)
			.status(
				volunteerActivity.getStatus()
			)
			.startTime(volunteerActivity.getStartTime())
			.build();
	}
	public static CurrentMatching ElderlyOf(VolunteerActivity volunteerActivity) {
		return CurrentMatching.builder()
			.matchingId(volunteerActivity.getId())
			.otherName(
				volunteerActivity.getVolunteer().getName()
			)
			.status(
				volunteerActivity.getStartTime().isBefore(LocalDateTime.now()) ? STARTED : NOT_STARTED)
			.startTime(
				volunteerActivity.getStartTime()
			)
			.build();
	}

}
