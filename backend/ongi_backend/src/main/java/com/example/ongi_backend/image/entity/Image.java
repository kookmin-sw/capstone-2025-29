package com.example.ongi_backend.image.entity;

import static jakarta.persistence.GenerationType.*;

import com.example.ongi_backend.review.entity.BaseReview;
import com.example.ongi_backend.review.entity.ElderlyReview;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Image {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	private String fileName;
	@ManyToOne
	@JoinColumn(name = "base_review_id")
	private ElderlyReview baseReview;
}
