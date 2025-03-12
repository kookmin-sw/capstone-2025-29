package com.example.ongi_backend.sentimentAnalysis.entity;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.FetchType.*;
import static jakarta.persistence.GenerationType.*;

import com.example.ongi_backend.global.entity.Analysis;
import com.example.ongi_backend.global.entity.BaseEntity;
import com.example.ongi_backend.user.entity.Elderly;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;

@Entity
@Getter
public class SentimentAnalysis extends BaseEntity {
	@Id
	@GeneratedValue(strategy = IDENTITY)
	private Long id;
	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "elderly_id")
	private Elderly elderly;
	@Enumerated(STRING)
	private Analysis result;
}
