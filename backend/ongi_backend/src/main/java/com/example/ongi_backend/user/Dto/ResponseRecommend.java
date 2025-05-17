package com.example.ongi_backend.user.Dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseRecommend {
	@Schema(description = "봉사자 4명 추천 리스트", example =
		"[{\"name\": \"김철수\", \"volunteerActivityTime\": 123, \"volunteerId\": 1, \"profileImageUrl\": \"profile/123-456-789\", \"bio\": \"산책을 좋아합니다.\"},"
		+ "{\"name\": \"이영희\", \"volunteerActivityTime\": 456, \"volunteerId\": 2, \"profileImageUrl\": \"profile/987-654-321\", \"bio\": \"산책을 좋아합니다.\"},"
		+ "{\"name\": \"박민수\", \"volunteerActivityTime\": 789, \"volunteerId\": 3, \"profileImageUrl\": \"profile/456-789-123\", \"bio\": \"산책을 좋아합니다.\"},"
		+ "{\"name\": \"최지우\", \"volunteerActivityTime\": 321, \"volunteerId\": 4, \"profileImageUrl\": \"profile/654-321-987\", \"bio\": \"산책을 좋아합니다.\"}]")
	private List<RecommendVolunteer> recommendVolunteers;
	@Schema(description = "매칭 ID", example = "1")
	private Long matchingId;

	static public ResponseRecommend of(List<RecommendVolunteer> recommendVolunteers, Long matchingId) {
		return ResponseRecommend.builder()
			.recommendVolunteers(recommendVolunteers)
			.matchingId(matchingId)
			.build();
	}
}
