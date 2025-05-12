package com.example.ongi_backend.user.Controller;

import com.example.ongi_backend.global.redis.service.VerificationCodeService;
import com.example.ongi_backend.user.Dto.RequestVerificationCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthCodeController {
    private final VerificationCodeService verificationCodeService;

    @PostMapping
    public ResponseEntity<?> sendVerificationCode(@RequestBody RequestVerificationCode requestVerificationCode) {
        verificationCodeService.sendVerificationCode(requestVerificationCode.getPhoneNumber());
        return ResponseEntity.ok("인증번호 발송");
    }

    @GetMapping
    public ResponseEntity<?> verifyVerificationCode(@RequestParam String phoneNumber, @RequestParam String verificationCode) {
        verificationCodeService.verifyVerificationCode(phoneNumber, verificationCode);
        return ResponseEntity.ok("인증번호 인증");
    }
}
