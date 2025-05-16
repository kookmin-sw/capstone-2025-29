package com.example.ongi_backend.sentimentAnalysis.dto;

import com.example.ongi_backend.global.entity.Analysis;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
@Schema(description = "감정 분석 응답 DTO")
public class ResponseSentimentAnalysis {
    @Schema(description = "감정별 백분율", example = """
        {
            "신남": 9,
            "분노": 17,
            "평온": 4,
            "두려움": 11,
            "설렘": 17,
            "외로움": 33,
            "기쁨": 9
        }
    """)
    private Map<String, Long> sentimentPercentages;
    @Schema(description = "감정분석 피드백", example = "우울감이 너무 높습니다. 병원 방문 부탁드립니다.")
    private String feedback;
    @Schema(description = "사용자의 챗봇 이름", example = "홍길동")
    private String chatBotName;
}
