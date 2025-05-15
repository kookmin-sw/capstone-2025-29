package com.example.ongi_backend.user.Service;

import com.example.ongi_backend.global.exception.CustomException;
import com.example.ongi_backend.global.exception.ErrorCode;
import com.example.ongi_backend.user.Dto.RequestModify;
import com.example.ongi_backend.user.Dto.RequestModifyPassword;
import com.example.ongi_backend.user.Dto.ResponseUserInfo;
import com.example.ongi_backend.user.Dto.UserRegisterDto;
import com.example.ongi_backend.user.Repository.BaseUserRepository;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.BaseUser;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.PrincipalDetails;
import com.example.ongi_backend.user.entity.Volunteer;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final BaseUserRepository baseUserRepository;
    private final ElderlyRepository elderlyRepository;
    private final VolunteerRepository volunteerRepository;
    private final PasswordEncoder passwordEncoder;

    public void saveUser(UserRegisterDto userRegisterDto) {
        if (baseUserRepository.countUsernameInBothTables(userRegisterDto.getUsername()) > 0)
            throw new CustomException(ErrorCode.ALREADY_EXIST_USER_ERROR);
        if ("elderly".equalsIgnoreCase(userRegisterDto.getUserType())) {
            Elderly elderly = Elderly.builder()
                    .name(userRegisterDto.getName())
                    .phone(userRegisterDto.getPhone())
                    .address(userRegisterDto.getAddress())
                    .age(userRegisterDto.getAge())
                    .gender(userRegisterDto.getGender())
                    .fcmToken(userRegisterDto.getPhoneCode())
                    .username(userRegisterDto.getUsername())
                    .password(passwordEncoder.encode(userRegisterDto.getPassword()))
                    .build();
            elderlyRepository.save(elderly);

        } else if ("volunteer".equalsIgnoreCase(userRegisterDto.getUserType())) {
            Volunteer volunteer = Volunteer.builder()
                    .name(userRegisterDto.getName())
                    .phone(userRegisterDto.getPhone())
                    .address(userRegisterDto.getAddress())
                    .age(userRegisterDto.getAge())
                    .gender(userRegisterDto.getGender())
                    .fcmToken(userRegisterDto.getPhoneCode())
                    .username(userRegisterDto.getUsername())
                    .password(passwordEncoder.encode(userRegisterDto.getPassword()))
                    .bio(userRegisterDto.getBio())
                    .build();
            volunteerRepository.save(volunteer);
        } else {
            throw new CustomException(ErrorCode.INVALID_USER_TYPE_ERROR);
        }
    }

    @Transactional
    public void modifyUser(RequestModify requestModify, String username) {
        BaseUser baseUser = findUserByUserName(username, requestModify.getUserType());

        baseUser.updateInfo(requestModify.getName(),
                requestModify.getAge(),
                requestModify.getGender(),
                requestModify.getPhone(),
                requestModify.getAddress(),
                requestModify.getPassword(),
                requestModify.getProfileImage());

        if(requestModify.getUserType().equals("volunteer")) {
            Volunteer volunteer = (Volunteer) baseUser;
            volunteer.updateBio(requestModify.getBio());
        }
    }

    public ResponseUserInfo getUser(String username, String userType) {
        BaseUser baseUser = findUserByUserName(username, userType);
        return ResponseUserInfo.builder()
                .name(baseUser.getName())
                .phone(baseUser.getPhone())
                .age(baseUser.getAge())
                .profileImage(baseUser.getProfileImage())
                .gender(baseUser.getGender())
                .address(baseUser.getAddress())
                .build();
    }
    public BaseUser findUserByUserName(String username, String userType) {
        if (userType.equalsIgnoreCase("volunteer")) {
            return volunteerRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else if (userType.equalsIgnoreCase("elderly")) {
            return elderlyRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_USER_ERROR));
        } else {
            throw new CustomException(ErrorCode.INVALID_USER_TYPE_ERROR);
        }
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
        BaseUser baseUser = findUserByUserName(username, userType);

        if (!passwordEncoder.matches(password, baseUser.getPassword()))
            throw new CustomException(ErrorCode.CREDENTIALS_NOT_MATCHED_ERROR);
    }

    @Transactional
    public void modifyPassword(String username, RequestModifyPassword requestModifyPassword) {
        BaseUser baseUser = findUserByUserName(username, requestModifyPassword.getUserType());

        baseUser.updatePassword(passwordEncoder.encode(requestModifyPassword.getPassword()));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String userType = (String) RequestContextHolder.getRequestAttributes().getAttribute("userType", RequestAttributes.SCOPE_REQUEST);

        if (userType.equalsIgnoreCase("volunteer")) {
            Volunteer volunteer = volunteerRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("유저가 존재하지 않습니다."));
            return PrincipalDetails.builder().baseUser(volunteer).build();
        } else if (userType.equalsIgnoreCase("elderly")) {
            Elderly elderly = elderlyRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("유저가 존재하지 않습니다."));
            return PrincipalDetails.builder().baseUser(elderly).build();
        }
        throw new UsernameNotFoundException("유저가 존재하지 않습니다.");
    }

    @Transactional
    public void modifyFcmToken(BaseUser baseUser, String userType, String fcmToken) {
        BaseUser user = findUserByUserName(baseUser.getUsername(), userType);
        user.updateFcmToken(fcmToken);
    }
}
