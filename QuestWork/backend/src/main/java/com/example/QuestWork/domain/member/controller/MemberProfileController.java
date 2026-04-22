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
    @GetMapping("/{userId}") // 💡 주소는 그대로지만 타입이 숫자형이 됩니다.
    public ResponseEntity<MemberProfileDto> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(memberProfileService.getProfile(userId));
    }
    @PutMapping("/{userId}")
    public ResponseEntity<String> updateProfile(@PathVariable Long userId, @RequestBody MemberUpdateDto dto) {
        memberProfileService.updateProfile(userId, dto);
        return ResponseEntity.ok("수정 완료");
    }
}