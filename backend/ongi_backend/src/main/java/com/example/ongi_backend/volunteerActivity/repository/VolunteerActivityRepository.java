package com.example.ongi_backend.volunteerActivity.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

@Repository
public interface VolunteerActivityRepository extends JpaRepository<VolunteerActivity, Long> {
	@Query("SELECT va FROM VolunteerActivity va JOIN FETCH va.elderly JOIN FETCH va.volunteer WHERE va.volunteer.username = :username AND va.isDone = true")
	List<VolunteerActivity> findCompleteActivitiesByUserName(String username);
	@Query("SELECT va FROM VolunteerActivity va JOIN FETCH va.elderly WHERE va.elderly.username = :username")
	List<VolunteerActivity> findRegisteredActivitiesByUserName(String username);

	@Query("SELECT va FROM VolunteerActivity va JOIN FETCH va.elderly JOIN FETCH va.volunteer WHERE va.id = :id")
	Optional<VolunteerActivity> findActivityAndElderlyById(Long id);

}
