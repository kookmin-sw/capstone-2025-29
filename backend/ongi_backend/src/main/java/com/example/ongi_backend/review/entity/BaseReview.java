package com.example.ongi_backend.review.entity;

import static jakarta.persistence.GenerationType.*;

import com.example.ongi_backend.global.entity.BaseEntity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class BaseReview extends BaseEntity {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	//TODO: 사진을 여러개 올릴수 있나?
	private String photo;
	private String content;
}
