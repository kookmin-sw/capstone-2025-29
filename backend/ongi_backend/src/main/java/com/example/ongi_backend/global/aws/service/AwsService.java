package com.example.ongi_backend.global.aws.service;

import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.Headers;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.example.ongi_backend.global.aws.dto.GetS3UrlDto;
import com.example.ongi_backend.user.Service.UserService;
import com.example.ongi_backend.user.entity.BaseUser;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AwsService {
	private final AmazonS3 amazonS3Client;
	private final UserService userService;
	@Value("${cloud.aws.s3.bucket}")
	private String bucketName;
	public GetS3UrlDto getUserImagePreSignedUrl(String userName, String type, String userType) {
		BaseUser user = userService.findUserByUserName(userName, userType);
		Long id = user.getId();
		String key = type + "/" + userType + "/" + id;
		Date expiration = getExpiration();
		GeneratePresignedUrlRequest generatePresignedUrlRequest = getPostObjectRequest(key, expiration);
		URL url = amazonS3Client.generatePresignedUrl(generatePresignedUrlRequest);
		return GetS3UrlDto.of(url.toExternalForm(), key);
	}
	public List<GetS3UrlDto> getReviewPreSignedUrl(int count) {
		ArrayList<GetS3UrlDto> preSignedUrls = new ArrayList<>();
		for(int i=0;i<count;i++){
			String key = "review/" + UUID.randomUUID();
			Date expiration = getExpiration();
			GeneratePresignedUrlRequest generatePresignedUrlRequest = getPostObjectRequest(key, expiration);
			URL url = amazonS3Client.generatePresignedUrl(generatePresignedUrlRequest);
			preSignedUrls.add(GetS3UrlDto.of(url.toExternalForm(), key));
		}
		return preSignedUrls;
	}
	private GeneratePresignedUrlRequest getPostObjectRequest(String fileName, Date expiration) {
		GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, fileName)
			.withMethod(HttpMethod.PUT)
			.withKey(fileName)
			.withExpiration(expiration);
		generatePresignedUrlRequest.addRequestParameter(
			Headers.S3_CANNED_ACL,
			CannedAccessControlList.PublicRead.toString()
		);
		return generatePresignedUrlRequest;
	}
	public static Date getExpiration(){
		Date expiration = new Date();
		long expTimeMillis = System.currentTimeMillis();
		expTimeMillis += 1000 * 60 * 60; // 1 hour
		expiration.setTime(expTimeMillis);
		return expiration;
	}

}
