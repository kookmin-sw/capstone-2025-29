package com.example.ongi_backend.global.aws.dto;

import static lombok.AccessLevel.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
@Data
public class SqsMessage {
	private String messageBody;
	private MessageAttributes messageAttributes;

	@Data
	@Builder
	public static class MessageAttributes{
		MessageAttribute title;
		MessageAttribute body;
		MessageAttribute token;
	}
	@Data
	@Builder
	public static class MessageAttribute{
		private String dataType;
		private String stringValue;
	}

}
