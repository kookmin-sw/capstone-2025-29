package com.example.ongi_backend.volunteerActivity.dto;

import static lombok.AccessLevel.*;

import java.time.LocalDateTime;

import com.example.ongi_backend.global.entity.VolunteerType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class ResponseRegisteredActivities {
	private Long id;
	private VolunteerType type;
	private LocalDateTime time;
	// TODO : 스웨거 변경사항 확인
}
