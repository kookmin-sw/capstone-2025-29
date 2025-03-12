package com.example.ongi_backend.review.entity;

import static jakarta.persistence.FetchType.*;

import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;

@Entity
@Getter
public class VolunteerReview extends BaseReview {
	@OneToOne(fetch = LAZY)
	@JoinColumn(name = "volunteer_activity_id")
	private VolunteerActivity volunteerActivity;
}
