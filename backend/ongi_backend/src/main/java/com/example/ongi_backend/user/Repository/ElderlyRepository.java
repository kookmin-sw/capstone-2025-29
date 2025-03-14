package com.example.ongi_backend.user.Repository;

import com.example.ongi_backend.user.entity.Elderly;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElderlyRepository extends JpaRepository<Elderly, Long> {
    boolean existsByUsername(String username);
}
