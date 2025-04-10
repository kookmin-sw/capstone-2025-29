package com.example.ongi_backend.global.aws.dto;

import static lombok.AccessLevel.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class GetS3UrlDto {
	private String preSignedUrl;
	private String key;
	public static GetS3UrlDto of(String preSignedUrl, String key) {
		return GetS3UrlDto.builder()
			.preSignedUrl(preSignedUrl)
			.key(key)
			.build();
	}
}
