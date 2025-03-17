package com.example.ongi_backend.user.Repository;

import com.example.ongi_backend.user.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    boolean existsByUsername(String username);
}
