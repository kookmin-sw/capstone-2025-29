package com.example.ongi_backend.global.redis.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.ongi_backend.global.redis.dto.UnMatching;

@Repository
public interface UnMatchingRepository extends CrudRepository<UnMatching, String> {
	@Override
	List<UnMatching> findAll();
}
