package com.example.ongi_backend.user.Repository;

import com.example.ongi_backend.global.entity.DistrictType;
import com.example.ongi_backend.user.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    boolean existsByUsername(String username);
    Optional<Volunteer> findByUsername(String username);

    @Query("select v from Volunteer v "
        + "join v.weeklyAvailableTimes w on w.volunteer = v "
        + "where w.dayOfWeek = :dayOfWeek "
        + "and w.availableStartTime = :availableStartTime "
        + "and bitand(v.volunteerCategory, :category) = :category "
        + "and v.address.district = :district "
        + "and not exists (select 1 from VolunteerActivity va where va.volunteer = v and date_format(va.startTime, '%Y-%m-%d') = :date)"
        + "order by function('RAND') limit 1")
    Optional<Volunteer> findByWeeklyAvailableTime(DayOfWeek dayOfWeek, LocalTime availableStartTime, LocalDate date, int category, DistrictType district);

    @Query("select v from Volunteer v "
        + "join v.weeklyAvailableTimes w on w.volunteer = v "
        + "where w.dayOfWeek = :dayOfWeek "
        + "and w.availableStartTime = :availableStartTime "
        + "and bitand(v.volunteerCategory, :category) = :category "
        + "and v.address.district = :district "
        + "and not exists (select 1 from VolunteerActivity va where va.volunteer = v and date_format(va.startTime, '%Y-%m-%d') = :date)"
        + "and v != :volunteer "
        + "order by function('RAND') limit 1")
    Optional<Volunteer> findByWeeklyAvailableTimeAndNotVolunteer(DayOfWeek dayOfWeek, LocalTime availableStartTime, LocalDate date, int category, DistrictType district, Volunteer volunteer);

    @Query("select v from Volunteer v "
        + "join v.weeklyAvailableTimes w on w.volunteer = v "
        + "where w.dayOfWeek = :dayOfWeek "
        + "and w.availableStartTime = :availableStartTime "
        + "and bitand(v.volunteerCategory, :category) = :category "
        + "and v.address.district = :district "
        + "and not exists (select 1 from VolunteerActivity va where va.volunteer = v and date_format(va.startTime, '%Y-%m-%d') = :date)")
    List<Volunteer> findAllByWeeklyAvailableTime(DayOfWeek dayOfWeek, LocalTime availableStartTime, LocalDate date, int category, DistrictType district);


}
