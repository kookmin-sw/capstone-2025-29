package com.example.ongi_backend.image.entity;

import static jakarta.persistence.GenerationType.*;

import com.example.ongi_backend.review.entity.VolunteerReview;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;

@Entity
@Getter
public class Image {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	private String fileName;
	@ManyToOne
	@JoinColumn(name = "base_review_id")
	private VolunteerReview baseReview;
	public static Image of(String fileName) {
		Image image = new Image();
		image.fileName = fileName;
		return image;
	}
	public void connectReview(VolunteerReview review) {
		this.baseReview = review;
		review.getImages().add(this);
	}
}
