package com.example.QuestWork.domain.member.controller;

import com.example.QuestWork.domain.member.dto.MemberProfileDto;


import com.example.QuestWork.domain.member.dto.MemberUpdateDto;
import com.example.QuestWork.domain.member.service.MemberProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class MemberProfileController {

    private final MemberProfileService memberProfileService;

    /**
     * 마이페이지 프로필 조회
     */
    @GetMapping("/{username}") // userId 대신 username으로 받기
    public ResponseEntity<MemberProfileDto> getProfile(@PathVariable String username) {
        return ResponseEntity.ok(memberProfileService.getProfileByUsername(username));
    }
    @PutMapping("/{username}")
    public ResponseEntity<String> updateProfile(@PathVariable String username, @RequestBody MemberUpdateDto dto) {
        memberProfileService.updateProfileByUsername(username, dto);
        return ResponseEntity.ok("수정 완료");
    }
}