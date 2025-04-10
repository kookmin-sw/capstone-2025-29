package com.example.ongi_backend.review.service;

import static com.example.ongi_backend.global.entity.VolunteerStatus.*;
import static com.example.ongi_backend.global.exception.ErrorCode.*;
import static java.util.stream.Collectors.*;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.image.entity.Image;
import com.example.ongi_backend.review.dto.RequestResistReview;
import com.example.ongi_backend.review.dto.ResponseDetailReview;
import com.example.ongi_backend.review.dto.ResponseReview;
import com.example.ongi_backend.review.entity.VolunteerReview;
import com.example.ongi_backend.review.repository.ReviewRepository;
import com.example.ongi_backend.user.Service.UserService;
import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;
import com.example.ongi_backend.volunteerActivity.service.VolunteerActivityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {
	private final ReviewRepository reviewRepository;
	private final VolunteerActivityService volunteerActivityService;
	private final UserService userService;

	@Transactional
	public void writeReview(RequestResistReview request, String username) {
		VolunteerActivity findVa = volunteerActivityService.findById(request.getVolunteerActivityId());
		Volunteer volunteer = (Volunteer)userService.findUserByUserName(username, "volunteer");
		// 리뷰 상태가 아니면 리뷰 작성 불가
		if(findVa.getStatus() != REVIEWING) {
			throw new CustomException(UNABLE_TO_WRITE_REVIEW_ERROR);
		}
		// 리뷰 작성자가 봉사자와 다르면 리뷰 작성 불가
		if(findVa.getVolunteer() == null || !findVa.getVolunteer().equals(volunteer)) {
			throw new CustomException(UNABLE_TO_WRITE_REVIEW_ERROR);
		}
		VolunteerReview review = VolunteerReview.of(findVa, "리뷰 내용", request.getImageUrls());
		reviewRepository.save(review);
		findVa.updateStatus(COMPLETED);
	}

	public List<ResponseReview> findReviews(String username) {
		Volunteer volunteer = (Volunteer)userService.findUserByUserName(username, "volunteer");
		List<VolunteerReview> findReview = reviewRepository.findByVolunteer(volunteer);

		return findReview.stream().map(
				review -> ResponseReview.of(review.getId(),
					review.getVolunteerActivity().getElderly().getName(),
					review.getVolunteerActivity().getType(), review.getVolunteerActivity().getAddress().getDistrict(),
					review.getVolunteerActivity().getStartTime()))
			.toList();
	}

	public ResponseDetailReview findDetailsReview(Long volunteerActivityId, String username) {
		Volunteer volunteer = (Volunteer)userService.findUserByUserName(username, "volunteer");

		VolunteerReview review = reviewRepository.findElderlyAndVolunteerActivityAndReviewByVolunteerActivityId(
			volunteerActivityId).orElseThrow(
			() -> new CustomException(NOT_FOUND_REVIEW_ERROR));

		// 리뷰 작성자가 봉사자와 다르면 리뷰 조회 불가
		if (!review.getVolunteerActivity().getVolunteer().getId().equals(volunteer.getId())) {
			throw new CustomException(REVIEW_ACCESS_DENIED_ERROR);
		}

		return ResponseDetailReview.of(
				review.getVolunteerActivity().getElderly().getName(),
				review.getVolunteerActivity().getType(),
				review.getVolunteerActivity().getAddress().getDistrict(),
				review.getVolunteerActivity().getStartTime(),
				review.getImages().stream().map(Image::getFileName).collect(toList()),
				review.getContent());
	}
}
