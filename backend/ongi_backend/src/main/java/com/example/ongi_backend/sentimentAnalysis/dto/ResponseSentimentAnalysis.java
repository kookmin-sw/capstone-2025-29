package com.example.ongi_backend.sentimentAnalysis.dto;

import com.example.ongi_backend.global.entity.Analysis;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class ResponseSentimentAnalysis {
    private Map<String, Long> sentimentPercentages;
    private String chatBotName;
}
