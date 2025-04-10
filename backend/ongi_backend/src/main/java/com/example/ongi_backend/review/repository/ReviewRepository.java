package com.example.ongi_backend.review.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.ongi_backend.review.entity.VolunteerReview;
import com.example.ongi_backend.user.entity.Volunteer;

public interface ReviewRepository extends JpaRepository<VolunteerReview, Long> {
	@Query("SELECT r FROM VolunteerReview r JOIN FETCH r.volunteerActivity va JOIN FETCH va.elderly e WHERE va.volunteer = :volunteer AND va.status= 'COMPLETED'")
	public List<VolunteerReview> findByVolunteer(Volunteer volunteer);

	@Query("SELECT r FROM VolunteerReview r JOIN FETCH r.volunteerActivity va JOIN FETCH va.elderly e JOIN FETCH r.images i WHERE va.id = :volunteerActivityId AND va.status = 'COMPLETED'")
	public Optional<VolunteerReview> findElderlyAndVolunteerActivityAndReviewByVolunteerActivityId(Long volunteerActivityId);

}
