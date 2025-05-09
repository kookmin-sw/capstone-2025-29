package com.example.ongi_backend.sentimentAnalysis.service;

import com.example.ongi_backend.global.entity.Analysis;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.exception.ErrorCode;
import com.example.ongi_backend.sentimentAnalysis.dto.RequestSentimentAnalysis;
import com.example.ongi_backend.sentimentAnalysis.entity.SentimentAnalysis;
import com.example.ongi_backend.sentimentAnalysis.repository.SentimentAnalysisRepository;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.entity.Elderly;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SentimentAnalysisService {
    private final SentimentAnalysisRepository sentimentAnalysisRepository;
    private final ElderlyRepository elderlyRepository;

    @Transactional
    public void saveSentimentAnalysis(RequestSentimentAnalysis request) {
        Elderly elderly = elderlyRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));

        SentimentAnalysis sentimentAnalysis = SentimentAnalysis.builder()
                .elderly(elderly)
                .result(request.getAnalysis())
                .analysisDate(request.getAnalysisDate())
                .build();
        sentimentAnalysisRepository.save(sentimentAnalysis);
    }
}
