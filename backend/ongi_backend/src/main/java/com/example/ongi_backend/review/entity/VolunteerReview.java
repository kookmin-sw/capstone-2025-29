package com.example.ongi_backend.review.entity;

import static lombok.AccessLevel.*;

import java.util.ArrayList;
import java.util.List;

import com.example.ongi_backend.image.entity.Image;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor(access = PROTECTED)
public class VolunteerReview extends BaseReview {
	public static VolunteerReview of(VolunteerActivity volunteerActivity, String content, List<String> imageStr) {

		VolunteerReview review = VolunteerReview.builder()
			.volunteerActivity(volunteerActivity)
			.content(content)
			.images(new ArrayList<>())
			.build();
		imageStr.forEach(fileName -> {
				Image.of(fileName).connectReview(review);
			});
		return review;
	}
}
