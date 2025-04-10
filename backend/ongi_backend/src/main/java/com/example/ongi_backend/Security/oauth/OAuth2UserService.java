package com.example.ongi_backend.Security.oauth;

import com.example.ongi_backend.global.entity.Gender;
import com.example.ongi_backend.user.Repository.ElderlyRepository;
import com.example.ongi_backend.user.Repository.VolunteerRepository;
import com.example.ongi_backend.user.entity.BaseUser;
import com.example.ongi_backend.user.entity.Elderly;
import com.example.ongi_backend.user.entity.PrincipalDetails;
import com.example.ongi_backend.user.entity.Volunteer;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {
    private final ElderlyRepository elderlyRepository;
    private final VolunteerRepository volunteerRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        Map<String, Object> oAuth2UserAttributes = (Map<String, Object>) oauth2User.getAttributes().get("kakao_account");

        KakaoUserInfo kakaoUserInfo = KakaoUserInfo.builder().attributes(oAuth2UserAttributes).build();

        // 1. Elderly에서 조회
        Optional<Elderly> elderlyOpt = elderlyRepository.findByUsername(kakaoUserInfo.getUsername());
        if (elderlyOpt.isPresent()) {
            return PrincipalDetails.builder().baseUser(elderlyOpt.get()).attributes(oAuth2UserAttributes).build();
        }

        // 2. Volunteer에서 조회
        Optional<Volunteer> volunteerOpt = volunteerRepository.findByUsername(kakaoUserInfo.getUsername());
        if (volunteerOpt.isPresent()) {
            return PrincipalDetails.builder().baseUser(volunteerOpt.get()).attributes(oAuth2UserAttributes).build();
        }

        // 3. 둘 다 없으면 Kakao 정보로 임시 유저 생성
        BaseUser user = TemporaryUser.builder()
                .gender(Gender.valueOf(kakaoUserInfo.getGender()))
                .name(kakaoUserInfo.getName())
                .username(kakaoUserInfo.getUsername())
                .password(UUID.randomUUID().toString())
                .phone(kakaoUserInfo.getPhoneNumber())
                .age(LocalDate.now().getYear() - Integer.parseInt(kakaoUserInfo.getBirthyear()) + 1)
                .build();

        return PrincipalDetails.builder().baseUser(user).attributes(oAuth2UserAttributes).build();
    }
}
