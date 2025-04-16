package com.example.ongi_backend.user.Controller;

import com.example.ongi_backend.global.redis.dto.RedisNotificationTemplate;
import com.example.ongi_backend.global.redis.service.NotificationRedisService;
import com.example.ongi_backend.user.Dto.RequestModify;
import com.example.ongi_backend.user.Dto.RequestModifyPassword;
import com.example.ongi_backend.user.Dto.ResponseUserInfo;
import com.example.ongi_backend.user.Dto.UserRegisterDto;
import com.example.ongi_backend.user.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final NotificationRedisService notificationRedisService;

    @GetMapping
    @Operation(summary = "유저 정보 가져오기", description = "수정 페이지 들어갈때 유저 정보 불러오기")
    public ResponseEntity<ResponseUserInfo> getUser(Principal principal, @RequestParam String userType) {
        ResponseUserInfo responseUserInfo = userService.getUser(principal.getName(), userType);
        return ResponseEntity.ok().body(responseUserInfo);
    }

    @GetMapping("/notification")
    public ResponseEntity<List<RedisNotificationTemplate>> getNotification(@RequestParam String userType, @RequestParam String userId) {
        List<RedisNotificationTemplate> notifications = notificationRedisService.findNotification(userId, userType);
        return ResponseEntity.ok().body(notifications);
    }

    @PostMapping
    @Operation(summary = "회원가입", description = "유저 저장")
    public ResponseEntity<?> addUser(@RequestBody UserRegisterDto userRegisterDto) {
        userService.saveUser(userRegisterDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    @Operation(summary = "유저 수정", description = "마이페이지 눌렀을때 유저 수정")
    public ResponseEntity<?> modifyUser(@RequestBody RequestModify requestModify, Principal principal) {
        userService.modifyUser(requestModify, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/username")
    @Operation(summary = "아이디 중복 체크", description = "회원가입 시 아이디 중복 체크")
    public ResponseEntity<?> duplicateCheck(@RequestParam String username, @RequestParam String userType) {
        userService.duplicateCheck(username, userType);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/password")
    @Operation(summary = "비밀번호 체크", description = "수정 페이지 비밀번호 확인")
    public ResponseEntity<?> passwordCheck(Principal principal, @RequestParam String password, @RequestParam String userType) {
        userService.passwordCheck(principal.getName(), userType, password);
        return ResponseEntity.ok().build();
    }

    @PatchMapping
    @Operation(summary = "비밀번호 수정", description = "수정 페이지 비밀번호 수정")
    public ResponseEntity<?> modifyPassword(Principal principal, @RequestBody RequestModifyPassword requestModifyPassword) {
        userService.modifyPassword(principal.getName(), requestModifyPassword);
        return ResponseEntity.ok().build();
    }
}
