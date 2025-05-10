package com.example.ongi_backend.sentimentAnalysis.repository;

import com.example.ongi_backend.sentimentAnalysis.entity.SentimentAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SentimentAnalysisRepository extends JpaRepository<SentimentAnalysis, Long> {
    @Query("SELECT s FROM SentimentAnalysis s " +
            "WHERE s.elderly.username = :username " +
            "AND s.analysisDate >= :startDate")
    List<SentimentAnalysis> findRecentByUsername(String username, LocalDate startDate);
}
