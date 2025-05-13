package com.example.ongi_backend.global.redis.repository;

import com.example.ongi_backend.global.redis.dto.VerificationCode;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationCodeRepository extends CrudRepository<VerificationCode, String> {
}
