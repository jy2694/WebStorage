package com.teger.webstorage.webstorage.controller;

import com.teger.webstorage.webstorage.dto.FileListDTO;
import com.teger.webstorage.webstorage.entity.Member;
import com.teger.webstorage.webstorage.properties.SessionProperties;
import com.teger.webstorage.webstorage.service.FileService;
import com.teger.webstorage.webstorage.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

@RestController()
@AllArgsConstructor
public class FileController {

    private final FileService fileService;
    private final MemberService memberService;
    private final SessionProperties sessionProperties;
    @PostMapping("/api/file/list")
    public ResponseEntity<Object> getFileList(@RequestBody FileListDTO dto) throws IOException {
        Long memberId = sessionProperties.findUserBySessionKey(dto.getSessionKey());
        if(memberId == null) return ResponseEntity.status(401).build();
        Optional<Member> memberOptional = memberService.findById(memberId);
        if(memberOptional.isEmpty()) return ResponseEntity.status(401).build();
        Member member = memberOptional.get();
        return ResponseEntity.ok(fileService.getFileList(member, dto.getPath()));
    }
}
