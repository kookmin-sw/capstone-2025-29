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
        promptBuilder.append("\n이 데이터를 바탕으로, 전문 심리상담가가 객관적으로 조언해 주세요. ");
        promptBuilder.append("현실적인 멘트를 7자 이내로 짧고 단호하게 해주세요. ");
        promptBuilder.append("기계적인 말투가 아닌 상담 전문가가 권유하는 듯한 자연스러운 표현으로 해주세요.");

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
