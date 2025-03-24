package com.example.ongi_backend.user.Controller;

import com.example.ongi_backend.user.Dto.RequestModify;
import com.example.ongi_backend.user.Dto.ResponseUserInfo;
import com.example.ongi_backend.user.Dto.UserRegisterDto;
import com.example.ongi_backend.user.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ResponseUserInfo> getUser(Principal principal, @RequestParam String userType) {
        ResponseUserInfo responseUserInfo = userService.getUser(principal.getName(), userType);
        return ResponseEntity.ok().body(responseUserInfo);
    }

    @PostMapping
    public ResponseEntity<?> addUser(@RequestBody UserRegisterDto userRegisterDto) {
        userService.saveUser(userRegisterDto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping
    public ResponseEntity<?> modifyUser(@RequestBody RequestModify requestModify, Principal principal) {
        userService.modifyUser(requestModify, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/username")
    public ResponseEntity<?> duplicateCheck(@RequestParam String username, @RequestParam String userType) {
        userService.duplicateCheck(username, userType);
        return ResponseEntity.ok().build();
    }
}
