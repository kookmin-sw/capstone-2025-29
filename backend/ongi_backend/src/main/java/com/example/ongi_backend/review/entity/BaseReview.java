package com.example.ongi_backend.review.entity;

import static jakarta.persistence.GenerationType.*;

import java.util.ArrayList;
import java.util.List;

import com.example.ongi_backend.global.entity.BaseEntity;
import com.example.ongi_backend.image.entity.Image;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;

@MappedSuperclass
public abstract class BaseReview extends BaseEntity {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	@OneToMany(mappedBy = "baseReview")
	private List<Image> images = new ArrayList<>();
	private String content;
}
