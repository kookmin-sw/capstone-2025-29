package com.example.ongi_backend.sentimentAnalysis.dto;

import com.example.ongi_backend.global.entity.Analysis;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RequestSentimentAnalysis {
    private String username;
    private Analysis analysis;
    private LocalDate analysisDate;
}
