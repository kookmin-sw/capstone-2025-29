package com.example.ongi_backend.user.Controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ongi_backend.user.Service.ElderlyService;
import com.example.ongi_backend.volunteerActivity.dto.RequestMatching;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/elderly")
public class ElderlyController {
	private final ElderlyService elderlyService;

	@PostMapping("/matching")
	public void activityMatching(@RequestBody RequestMatching request, Principal principal) {
		elderlyService.matching(request,
			//TODO : 로그인 구현 후 수정
			// principal.getName()
			"username"
		);
	}

	@DeleteMapping("/matching/{matchingId}")
	public void cancelMatching(@PathVariable Long matchingId ,Principal principal) {
		elderlyService.cancelMatching(matchingId,
			//TODO : 로그인 구현 후 수정
			// principal.getName()
			"username"
		);
	}

}
