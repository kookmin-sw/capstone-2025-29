package com.example.ongi_backend.user.Service;

import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.exception.ErrorCode;
import com.example.ongi_backend.user.Dto.RequestModify;
import com.example.ongi_backend.user.Dto.RequestModifyPassword;
import com.example.ongi_backend.user.Dto.ResponseUserInfo;
import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.exception.ErrorCode;
import com.example.ongi_backend.user.Dto.UserRegisterDto;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.BaseUser;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.PrincipleDetails;
import com.example.ongi_backend.user.entity.Volunteer;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final ElderlyRepository elderlyRepository;
    private final VolunteerRepository volunteerRepository;
    private final PasswordEncoder passwordEncoder;

    public void saveUser(UserRegisterDto userRegisterDto) {
        if ("elderly".equalsIgnoreCase(userRegisterDto.getUserType())) {
            if (elderlyRepository.existsByUsername(userRegisterDto.getUsername()))
                throw new CustomException(ErrorCode.ALREADY_EXIST_USER_ERROR);
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
                throw new CustomException(ErrorCode.ALREADY_EXIST_USER_ERROR);
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
            throw new CustomException(ErrorCode.INVALID_USER_TYPE_ERROR);
        }
    }

    @Transactional
    public void modifyUser(RequestModify requestModify, String username) {
        BaseUser baseUser;
        if (requestModify.getUserType().equalsIgnoreCase("volunteer")) {
            baseUser = volunteerRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else if (requestModify.getUserType().equalsIgnoreCase("elderly")) {
            baseUser = elderlyRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else {
            throw new CustomException(ErrorCode.INVALID_USER_TYPE_ERROR);
        }
        Optional.ofNullable(requestModify.getName()).ifPresent(baseUser::setName);
        if (requestModify.getAge() > 0) baseUser.setAge(requestModify.getAge());
        Optional.ofNullable(requestModify.getGender()).ifPresent(baseUser::setGender);
        Optional.ofNullable(requestModify.getPhone()).ifPresent(baseUser::setPhone);
        Optional.ofNullable(requestModify.getAddress()).ifPresent(baseUser::setAddress);
        Optional.ofNullable(requestModify.getPassword()).ifPresent(baseUser::setPassword);
        Optional.ofNullable(requestModify.getProfileImage()).ifPresent(baseUser::setProfileImage);
    }

    public ResponseUserInfo getUser(String username, String userType) {
        BaseUser baseUser;
        if (userType.equalsIgnoreCase("volunteer")) {
            baseUser = volunteerRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else if (userType.equalsIgnoreCase("elderly")) {
            baseUser = elderlyRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else {
            throw new CustomException(ErrorCode.INVALID_USER_TYPE_ERROR);
        }
        return ResponseUserInfo.builder()
                .name(baseUser.getName())
                .phone(baseUser.getPhone())
                .age(baseUser.getAge())
                .profileImage(baseUser.getProfileImage())
                .gender(baseUser.getGender())
                .address(baseUser.getAddress())
                .build();
    }

    public void duplicateCheck(String username, String userType) {
        if (userType.equalsIgnoreCase("volunteer")) {
            if (volunteerRepository.existsByUsername(username))
                throw new CustomException(ErrorCode.ALREADY_EXIST_USER_ERROR);
        } else if (userType.equalsIgnoreCase("elderly")) {
            if (elderlyRepository.existsByUsername(username))
                throw new CustomException(ErrorCode.ALREADY_EXIST_USER_ERROR);
        } else {
            throw new CustomException(ErrorCode.INVALID_USER_TYPE_ERROR);
        }
    }

    public void passwordCheck(String username, String userType, String password) {
        BaseUser baseUser;
        if (userType.equalsIgnoreCase("volunteer")) {
            baseUser = volunteerRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else if (userType.equalsIgnoreCase("elderly")) {
            baseUser = elderlyRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else {
            throw new CustomException(ErrorCode.INVALID_USER_TYPE_ERROR);
        }

        if (!passwordEncoder.matches(password, baseUser.getPassword()))
            throw new CustomException(ErrorCode.CREDENTIALS_NOT_MATCHED_ERROR);
    }

    @Transactional
    public void modifyPassword(String username, RequestModifyPassword requestModifyPassword) {
        BaseUser baseUser;
        if (requestModifyPassword.getUserType().equalsIgnoreCase("volunteer")) {
            baseUser = volunteerRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else if (requestModifyPassword.getUserType().equalsIgnoreCase("elderly")) {
            baseUser = elderlyRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else {
            throw new CustomException(ErrorCode.INVALID_USER_TYPE_ERROR);
        }

        baseUser.setPassword(passwordEncoder.encode(requestModifyPassword.getPassword()));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String userType = (String) RequestContextHolder.getRequestAttributes().getAttribute("userType", RequestAttributes.SCOPE_REQUEST);

        if (userType.equalsIgnoreCase("volunteer")) {
            Volunteer volunteer = volunteerRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("유저가 존재하지 않습니다."));
            return PrincipleDetails.builder().baseUser(volunteer).build();
        } else if (userType.equalsIgnoreCase("elderly")) {
            Elderly elderly = elderlyRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("유저가 존재하지 않습니다."));
            return PrincipleDetails.builder().baseUser(elderly).build();
        }
        throw new UsernameNotFoundException("유저가 존재하지 않습니다.");
    }
}
