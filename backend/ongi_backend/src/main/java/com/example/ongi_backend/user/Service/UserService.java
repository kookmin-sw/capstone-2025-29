package com.example.ongi_backend.user.Service;

import com.example.ongi_backend.user.Dto.UserRegisterDto;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.Volunteer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final ElderlyRepository elderlyRepository;
    private final VolunteerRepository volunteerRepository;

    public void saveUser(UserRegisterDto userRegisterDto) {
        if ("elderly".equalsIgnoreCase(userRegisterDto.getUserType())) {
            if (elderlyRepository.existsByUsername(userRegisterDto.getUsername()))
                throw new RuntimeException();
            Elderly elderly = new Elderly(
                    userRegisterDto.getUsername(),
                    userRegisterDto.getPassword(),
                    userRegisterDto.getName(),
                    userRegisterDto.getAge(),
                    userRegisterDto.getGender(),
                    userRegisterDto.getPhone(),
                    userRegisterDto.getAddress(),
                    userRegisterDto.getProfileImage(),
                    userRegisterDto.getPhoneCode()
            );
            elderlyRepository.save(elderly);

        } else if ("volunteer".equalsIgnoreCase(userRegisterDto.getUserType())) {
            if (volunteerRepository.existsByUsername(userRegisterDto.getUsername()))
                throw new RuntimeException();
            Volunteer volunteer = new Volunteer(
                    userRegisterDto.getUsername(),
                    userRegisterDto.getPassword(),
                    userRegisterDto.getName(),
                    userRegisterDto.getAge(),
                    userRegisterDto.getGender(),
                    userRegisterDto.getPhone(),
                    userRegisterDto.getAddress(),
                    userRegisterDto.getProfileImage(),
                    userRegisterDto.getPhoneCode()
            );
            volunteerRepository.save(volunteer);
        } else {
            throw new RuntimeException();
        }
    }
}
