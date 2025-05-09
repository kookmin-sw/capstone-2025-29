package com.example.ongi_backend.sentimentAnalysis.repository;

import com.example.ongi_backend.sentimentAnalysis.entity.SentimentAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SentimentAnalysisRepository extends JpaRepository<SentimentAnalysis, Long> {
}
