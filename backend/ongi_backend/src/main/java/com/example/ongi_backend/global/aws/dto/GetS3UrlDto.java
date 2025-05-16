package com.example.ongi_backend.global.aws.dto;

import static lombok.AccessLevel.*;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class GetS3UrlDto {
	@Schema(description = "preSignedUrl, 해당 주소로 put 요청하면 파일 저장", example = "https://ongi-s3.s3.ap-northeast-2.amazonaws.com/review/bb0b4359-731e-4cf5-baf0-52251e6b2447?x-amz-acl=public-read&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250417T051806Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIA35J7HFTKDPCWDE7P%2F20250417%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=8bd1ceb36001c3bd8be146e6f97503802e5aecc498607641b347a823bb844902")
	private String preSignedUrl;
	@Schema(description = "S3에 저장될 파일의 key, DB에 저장되는 방식", example = "review/bb0b4359-731e-4cf5-baf0-52251e6b2447")
	private String key;
	public static GetS3UrlDto of(String preSignedUrl, String key) {
		return GetS3UrlDto.builder()
			.preSignedUrl(preSignedUrl)
			.key(key)
			.build();
	}
}
