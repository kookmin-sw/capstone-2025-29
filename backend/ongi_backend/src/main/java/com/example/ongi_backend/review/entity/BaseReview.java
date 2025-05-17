package com.example.ongi_backend.review.entity;

import static jakarta.persistence.CascadeType.*;
import static jakarta.persistence.FetchType.*;
import static jakarta.persistence.GenerationType.*;
import static lombok.AccessLevel.*;

import java.util.ArrayList;
import java.util.List;

import com.example.ongi_backend.global.entity.BaseBuilderEntity;
import com.example.ongi_backend.image.entity.Image;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@MappedSuperclass
@SuperBuilder
@NoArgsConstructor(access = PROTECTED)
@Getter
public abstract class BaseReview extends BaseBuilderEntity {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	@OneToOne(fetch = LAZY)
	@JoinColumn(name = "volunteer_activity_id")
	private VolunteerActivity volunteerActivity;
	@OneToMany(mappedBy = "baseReview", cascade = PERSIST, orphanRemoval = true)
	private List<Image> images = new ArrayList<>();
	private String content;
}
