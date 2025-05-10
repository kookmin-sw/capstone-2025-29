package com.example.ongi_backend.sentimentAnalysis.controller;

import com.example.ongi_backend.sentimentAnalysis.dto.RequestSentimentAnalysis;
import com.example.ongi_backend.sentimentAnalysis.dto.ResponseSentimentAnalysis;
import com.example.ongi_backend.sentimentAnalysis.service.SentimentAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sentimentAnalysis")
public class SentimentAnalysisController {
    private final SentimentAnalysisService sentimentAnalysisService;

    @PostMapping
    public ResponseEntity<?> saveEmotion(@RequestBody RequestSentimentAnalysis request) {
        sentimentAnalysisService.saveSentimentAnalysis(request);
        return ResponseEntity.ok("감정 분석 저장");
    }

    @GetMapping
    public ResponseEntity<?> getSentimentAnalysis(Principal principal) {
        ResponseSentimentAnalysis response = sentimentAnalysisService.getSentimentAnalysis(principal.getName());
        return ResponseEntity.ok(response);
    }
}
