package com.example.ongi_backend.user.Controller;

import com.example.ongi_backend.global.redis.service.VerificationCodeService;
import com.example.ongi_backend.user.Dto.RequestVerificationCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthCodeController {
    private final VerificationCodeService verificationCodeService;

    @PostMapping
    @Operation(summary = "인증번호 발송", description = "description = \"전화번호는 +8210xxxx 형태로 입력")
    public ResponseEntity<?> sendVerificationCode(@Valid @RequestBody RequestVerificationCode requestVerificationCode) {
        verificationCodeService.sendVerificationCode(requestVerificationCode.getPhoneNumber());
        return ResponseEntity.ok("인증번호 발송");
    }

    @GetMapping
    @Operation(summary = "인증번호 인증", description = "인증번호 인증")
    public ResponseEntity<?> verifyVerificationCode(
            @RequestParam @Parameter(description = "전화번호 (예: +821012345678)") String phoneNumber,
            @RequestParam @Parameter(description = "인증번호 6자리") String verificationCode) {
        verificationCodeService.verifyVerificationCode(phoneNumber, verificationCode);
        return ResponseEntity.ok("인증번호 인증");
    }
}
