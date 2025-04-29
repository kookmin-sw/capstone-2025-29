package com.example.ongi_backend.user.Repository;

import com.example.ongi_backend.user.entity.BaseUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BaseUserRepository extends JpaRepository<BaseUser, Long> {
    @Query(value = "SELECT COUNT(*) FROM ( " +
            "SELECT username FROM elderly WHERE username = :username " +
            "UNION ALL " +
            "SELECT username FROM volunteer WHERE username = :username " +
            ") AS combined", nativeQuery = true)
    int countUsernameInBothTables(String username);
}
