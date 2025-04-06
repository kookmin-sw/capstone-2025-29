package com.example.ongi_backend.user.Controller;

import com.example.ongi_backend.global.redis.dto.RedisNotificationTemplate;
import com.example.ongi_backend.global.redis.service.NotificationRedisService;
import com.example.ongi_backend.user.Dto.RequestModify;
import com.example.ongi_backend.user.Dto.RequestModifyPassword;
import com.example.ongi_backend.user.Dto.ResponseUserInfo;
import com.example.ongi_backend.user.Dto.UserRegisterDto;
import com.example.ongi_backend.user.Service.UserService;
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
    public ResponseEntity<?> addUser(@RequestBody UserRegisterDto userRegisterDto) {
        userService.saveUser(userRegisterDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<?> modifyUser(@RequestBody RequestModify requestModify, Principal principal) {
        userService.modifyUser(requestModify, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/username")
    public ResponseEntity<?> duplicateCheck(@RequestParam String username, @RequestParam String userType) {
        userService.duplicateCheck(username, userType);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/password")
    public ResponseEntity<?> passwordCheck(Principal principal, @RequestParam String password, @RequestParam String userType) {
        userService.passwordCheck(principal.getName(), userType, password);
        return ResponseEntity.ok().build();
    }

    @PatchMapping
    public ResponseEntity<?> modifyPassword(Principal principal, @RequestBody RequestModifyPassword requestModifyPassword) {
        userService.modifyPassword(principal.getName(), requestModifyPassword);
        return ResponseEntity.ok().build();
    }
}
