package com.example.ongi_backend.volunteerActivity.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.ongi_backend.user.entity.Volunteer;
import com.example.ongi_backend.volunteerActivity.entity.VolunteerActivity;

@Repository
public interface VolunteerActivityRepository extends JpaRepository<VolunteerActivity, Long> {
	@Query("SELECT va FROM VolunteerActivity va JOIN FETCH va.elderly JOIN FETCH va.volunteer WHERE va.volunteer.username = :username AND va.status = 'COMPLETED'")
	List<VolunteerActivity> findCompleteActivitiesByUserName(String username);
	@Query("SELECT va FROM VolunteerActivity va JOIN FETCH va.elderly WHERE va.elderly.username = :username")
	List<VolunteerActivity> findRegisteredActivitiesByUserName(String username);

	@Query("SELECT va FROM VolunteerActivity va JOIN FETCH va.elderly JOIN FETCH va.volunteer WHERE va.id = :id")
	Optional<VolunteerActivity> findActivityAndElderlyById(Long id);

	@Query("SELECT va FROM VolunteerActivity va JOIN FETCH va.elderly JOIN FETCH va.volunteer WHERE va.volunteer.username = :username")
	List<VolunteerActivity> findMatchingByUserName(String username);

	@Query("SELECT va FROM VolunteerActivity va where va.volunteer = :volunteer AND date_format(va.startTime, '%Y-%m-%d') = :startTime")
	Optional<VolunteerActivity> findByStartTimeAndVolunteer(LocalDate startTime, Volunteer volunteer);
}
