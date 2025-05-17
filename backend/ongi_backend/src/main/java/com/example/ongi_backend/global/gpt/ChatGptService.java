package com.example.ongi_backend.global.gpt;

import com.example.ongi_backend.global.config.ChatGptConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatGptService {

    private final RestTemplate restTemplate;
    private final ChatGptConfig chatGptConfig;
    private final HttpHeaders baseHeaders;

    public String getChatGptAnswer(Map<String, Long> percentageMap) {
        HttpHeaders headers = new HttpHeaders();
        headers.putAll(baseHeaders);

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("다음은 한 사람의 감정 분석 결과입니다.\n\n");
        percentageMap.forEach((emotion, percentage) -> {
            promptBuilder.append(String.format("- %s: %d%%\n", emotion, percentage));
        });
        promptBuilder.append("\n이 데이터를 바탕으로, 이 사람의 현재 감정 상태를 분석하고 적절한 피드백을 주세요.  \n" +
                "- 슬픔, 분노, 불안 등 부정적인 감정이 높을 경우: 위로와 함께 전문가 상담, 휴식, 산책 등 실질적인 조치를 권장해주세요.  \n" +
                "- 행복, 평온 등 긍정적인 감정이 높을 경우: 긍정적인 감정을 유지하도록 격려해주세요.\n" +
                "\n" +
                "**조건:**\n" +
                "- 1~2줄\n" +
                "- 지나치게 포괄적이지 말고, 구체적이고 현실적인 행동을 제시해주세요.\n" +
                "- 상담사가 말하듯 따뜻하고 진심 어린 어투로 작성해주세요.");

        ChatGptRequest.Message message = new ChatGptRequest.Message("user", promptBuilder.toString());
        ChatGptRequest request = new ChatGptRequest(chatGptConfig.getModel(), Collections.singletonList(message));

        HttpEntity<ChatGptRequest> httpEntity = new HttpEntity<>(request, headers);

        ResponseEntity<ChatGptResponse> response = restTemplate.exchange(
                chatGptConfig.getUrl(),
                HttpMethod.POST,
                httpEntity,
                ChatGptResponse.class
        );

        return response.getBody()
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();
    }
}
