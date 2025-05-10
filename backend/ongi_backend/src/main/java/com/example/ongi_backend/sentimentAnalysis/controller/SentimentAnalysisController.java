package com.example.ongi_backend.sentimentAnalysis.controller;

import com.example.ongi_backend.sentimentAnalysis.dto.RequestSentimentAnalysis;
import com.example.ongi_backend.sentimentAnalysis.dto.ResponseSentimentAnalysis;
import com.example.ongi_backend.sentimentAnalysis.service.SentimentAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "감정 분석 결과 저장", description = "감정 분석 결과 저장")
    public ResponseEntity<?> saveEmotion(@RequestBody RequestSentimentAnalysis request) {
        sentimentAnalysisService.saveSentimentAnalysis(request);
        return ResponseEntity.ok("감정 분석 저장");
    }

    @GetMapping
    @Operation(summary = "감정 분석 결과 불러오기", description = "감정 분석 결과 불러오기")
    public ResponseEntity<ResponseSentimentAnalysis> getSentimentAnalysis(Principal principal) {
        ResponseSentimentAnalysis response = sentimentAnalysisService.getSentimentAnalysis(principal.getName());
        return ResponseEntity.ok(response);
    }
}
