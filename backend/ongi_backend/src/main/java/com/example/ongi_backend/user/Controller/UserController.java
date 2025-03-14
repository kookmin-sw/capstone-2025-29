package com.example.ongi_backend.user.Controller;

import com.example.ongi_backend.user.Dto.UserRegisterDto;
import com.example.ongi_backend.user.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> addUser(@RequestBody UserRegisterDto userRegisterDto) {
        userService.saveUser(userRegisterDto);
        return ResponseEntity.ok().build();
    }
}
