package com.teger.webstorage.webstorage.service;

import com.teger.webstorage.webstorage.dto.SignInDTO;
import com.teger.webstorage.webstorage.dto.SignUpDTO;
import com.teger.webstorage.webstorage.entity.Member;
import com.teger.webstorage.webstorage.properties.EncryptProperties;
import com.teger.webstorage.webstorage.properties.SessionProperties;
import com.teger.webstorage.webstorage.repository.MemberRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final EncryptProperties encryptProperties;
    private final SessionProperties sessionProperties;

    public Optional<Member> findById(Long id){
        return memberRepository.findById(id);
    }

    public Optional<Member> findEnableMemberByUserId(String userId){
        return memberRepository.findByActiveTrueAndUserId(userId);
    }

    public UUID signInProcess(SignInDTO dto){
        Optional<Member> memberOptional = findEnableMemberByUserId(dto.getUserId());
        if(memberOptional.isEmpty()) return null;
        Member member = memberOptional.get();
        String encryptedPassword = encryptProperties.encrypt(dto.getUserPw());
        if(!member.getUserPw().equals(encryptedPassword)) return null;
        return sessionProperties.createSession(member.getId());
    }

    public void signUpProcess(SignUpDTO dto){
        Member member = Member.builder()
                .userId(dto.getUserId())
                .userPw(encryptProperties.encrypt(dto.getUserPw()))
                .email(dto.getEmail())
                .active(true)
                .build();
        memberRepository.save(member);
    }

    public void signOutProcess(UUID sessionKey){
        sessionProperties.expireSessionKey(sessionKey);
    }

    public boolean existUserId(String userId){
        return memberRepository.findByActiveTrueAndUserId(userId).isPresent();
    }
}
