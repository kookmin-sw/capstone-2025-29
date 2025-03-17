package com.example.ongi_backend.volunteerActivity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

@Repository
public interface VolunteerActivityRepository extends JpaRepository<VolunteerActivity, Long> {
	@Query("SELECT va FROM VolunteerActivity va JOIN FETCH va.volunteer WHERE va.volunteer.username = :username AND va.isDone = true")
	List<VolunteerActivity> findCompleteActivitiesByUserName(String username);
}
