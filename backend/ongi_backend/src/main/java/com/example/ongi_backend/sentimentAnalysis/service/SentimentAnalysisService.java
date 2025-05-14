package com.example.ongi_backend.sentimentAnalysis.service;

import com.example.ongi_backend.global.entity.Analysis;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.exception.ErrorCode;
import com.example.ongi_backend.global.gpt.ChatGptService;
import com.example.ongi_backend.sentimentAnalysis.dto.RequestSentimentAnalysis;
import com.example.ongi_backend.sentimentAnalysis.dto.ResponseSentimentAnalysis;
import com.example.ongi_backend.sentimentAnalysis.entity.SentimentAnalysis;
import com.example.ongi_backend.sentimentAnalysis.repository.SentimentAnalysisRepository;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.Service.UserService;
import com.example.ongi_backend.user.entity.Elderly;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SentimentAnalysisService {
    private final SentimentAnalysisRepository sentimentAnalysisRepository;
    private final UserService userService;
    private final ChatGptService chatGptService;

    @Transactional
    public void saveSentimentAnalysis(RequestSentimentAnalysis request) {
        Elderly elderly = (Elderly) userService.findUserByUserName(request.getUsername(), "elderly");

        SentimentAnalysis sentimentAnalysis = SentimentAnalysis.builder()
                .elderly(elderly)
                .result(request.getAnalysis())
                .analysisDate(request.getAnalysisDate())
                .build();
        sentimentAnalysisRepository.save(sentimentAnalysis);
    }

    public ResponseSentimentAnalysis getSentimentAnalysis(String username) {
        Elderly elderly = (Elderly) userService.findUserByUserName(username, "elderly");

        LocalDate startDate = LocalDate.now().minusDays(30);
        List<SentimentAnalysis> analyses = sentimentAnalysisRepository.findRecentByUsername(username, startDate);

        Map<String, Long> percentageMap = calculateEmotionPercentages(analyses);

        return ResponseSentimentAnalysis.builder()
                .sentimentPercentages(percentageMap)
                .chatBotName(elderly.getChatBot().getName())
                .feedback(chatGptService.getChatGptAnswer(percentageMap))
                .build();
    }

    private Map<String, Long> calculateEmotionPercentages(List<SentimentAnalysis> analyses) {
        Map<Analysis, Long> countMap = analyses.stream()
                .collect(Collectors.groupingBy(SentimentAnalysis::getResult, Collectors.counting()));

        int total = analyses.size();
        if (total == 0) {
            return new HashMap<>();
        }

        // 1. 실수 기반 비율 계산
        Map<Analysis, Double> rawPercentages = new HashMap<>();
        for (Analysis emotion : Analysis.values()) {
            long count = countMap.getOrDefault(emotion, 0L);
            double percent = (count * 100.0) / total;
            rawPercentages.put(emotion, percent);
        }

        // 2. 내림 후 합계 계산
        Map<Analysis, Integer> flooredMap = new HashMap<>();
        int flooredSum = 0;
        for (Map.Entry<Analysis, Double> entry : rawPercentages.entrySet()) {
            int floored = (int) Math.floor(entry.getValue());
            flooredMap.put(entry.getKey(), floored);
            flooredSum += floored;
        }

        // 3. 보정값 분배
        int correction = 100 - flooredSum;
        List<Analysis> sortedByRemainder = rawPercentages.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue() % 1, a.getValue() % 1))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        for (int i = 0; i < correction; i++) {
            Analysis key = sortedByRemainder.get(i);
            flooredMap.put(key, flooredMap.get(key) + 1);
        }

        // 4. 최종 Map<String, Long> 반환
        return flooredMap.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().getDescription(),
                        entry -> entry.getValue().longValue()
                ));
    }
}
