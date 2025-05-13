package com.example.ongi_backend.global.grpc;

import static recommendation.UserRecommendationServiceGrpc.*;

import java.util.List;

import org.springframework.stereotype.Component;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import recommendation.UserRecommendation.RecommendationRequest;
import recommendation.UserRecommendation.RecommendationResponse;

@Component
public class GrpcUserClient {
	public List<Long> getRecommendedUsers(List<Long> userIds, String addDescription) {
		// gRPC 서버와 연결을 위한 채널 생성
		ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 50051)
				.usePlaintext()
				.build();

		UserRecommendationServiceBlockingStub stub = newBlockingStub(channel);

		RecommendationRequest request = RecommendationRequest.newBuilder()
				.addAllUserIds(userIds)
				.setElderlyDetail(addDescription)
				.build();

		RecommendationResponse response = stub.getRecommendedUsers(request);

		channel.shutdown();

		return response.getRecommendedUserIdsList();
	}
}
