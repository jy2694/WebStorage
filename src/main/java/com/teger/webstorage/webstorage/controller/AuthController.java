package com.teger.webstorage.webstorage.controller;

import com.teger.webstorage.webstorage.dto.SignInDTO;
import com.teger.webstorage.webstorage.dto.SignUpDTO;
import com.teger.webstorage.webstorage.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController()
@AllArgsConstructor
public class AuthController {

    private final MemberService memberService;

    @PostMapping("/api/auth/signin")
    public ResponseEntity<Object> signInProcess(@RequestBody SignInDTO dto){
        UUID sessionKey = memberService.signInProcess(dto);
        if(sessionKey == null)
            return ResponseEntity.status(401).build();
        else
            return ResponseEntity.ok(sessionKey);
    }

    @PostMapping("/api/auth/signup")
    public ResponseEntity<Object> signUpProcess(@RequestBody SignUpDTO dto){
        if(memberService.existUserId(dto.getUserId()))
            return ResponseEntity.status(401).body("Already exist user ID.");
        memberService.signUpProcess(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/auth/signout")
    public ResponseEntity<Object> signOutProcess(@RequestBody UUID sessionKey){
        memberService.signOutProcess(sessionKey);
        return ResponseEntity.ok().build();
    }
}
