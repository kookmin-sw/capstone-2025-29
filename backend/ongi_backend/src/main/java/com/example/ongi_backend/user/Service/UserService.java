package com.example.ongi_backend.user.Service;

import com.example.ongi_backend.user.Dto.UserRegisterDto;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.Volunteer;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final ElderlyRepository elderlyRepository;
    private final VolunteerRepository volunteerRepository;
    private final PasswordEncoder passwordEncoder;

    public void saveUser(UserRegisterDto userRegisterDto) {
        if ("elderly".equalsIgnoreCase(userRegisterDto.getUserType())) {
            if (elderlyRepository.existsByUsername(userRegisterDto.getUsername()))
                throw new RuntimeException();
            Elderly elderly = Elderly.builder()
                    .name(userRegisterDto.getName())
                    .phone(userRegisterDto.getPhone())
                    .address(userRegisterDto.getAddress())
                    .age(userRegisterDto.getAge())
                    .gender(userRegisterDto.getGender())
                    .profileImage(userRegisterDto.getProfileImage())
                    .phoneCode(userRegisterDto.getPhoneCode())
                    .username(userRegisterDto.getUsername())
                    .password(passwordEncoder.encode(userRegisterDto.getPassword()))
                    .build();
            elderlyRepository.save(elderly);

        } else if ("volunteer".equalsIgnoreCase(userRegisterDto.getUserType())) {
            if (volunteerRepository.existsByUsername(userRegisterDto.getUsername()))
                throw new RuntimeException();
            Volunteer volunteer = Volunteer.builder()
                    .name(userRegisterDto.getName())
                    .phone(userRegisterDto.getPhone())
                    .address(userRegisterDto.getAddress())
                    .age(userRegisterDto.getAge())
                    .gender(userRegisterDto.getGender())
                    .profileImage(userRegisterDto.getProfileImage())
                    .phoneCode(userRegisterDto.getPhoneCode())
                    .username(userRegisterDto.getUsername())
                    .password(passwordEncoder.encode(userRegisterDto.getPassword()))
                    .build();
            volunteerRepository.save(volunteer);
        } else {
            throw new RuntimeException();
        }
    }
}
