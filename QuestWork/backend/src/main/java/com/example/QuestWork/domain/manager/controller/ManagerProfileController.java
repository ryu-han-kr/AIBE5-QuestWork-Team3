package com.example.QuestWork.domain.manager.controller;

import com.example.QuestWork.domain.manager.dto.ManagerProfileResponseDto;
import com.example.QuestWork.domain.manager.dto.ManagerUpdateRequestDto;

import com.example.QuestWork.domain.manager.service.ManagerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerProfileController {

    private final ManagerProfileService managerProfileService;

    // 조회: GET /api/manager/34
    @GetMapping("/{userId}")
    public ResponseEntity<ManagerProfileResponseDto> getManagerProfile(@PathVariable Long userId) {
        ManagerProfileResponseDto response = managerProfileService.getManagerProfile(userId);
        return ResponseEntity.ok(response);
    }

    // 수정: PUT /api/manager/34
    @PutMapping("/{userId}")
    public ResponseEntity<String> updateManagerProfile(
            @PathVariable Long userId,
            @RequestBody ManagerUpdateRequestDto updateDto) {

        managerProfileService.updateManagerProfile(userId, updateDto);
        return ResponseEntity.ok("매니저 프로필이 성공적으로 수정되었습니다.");
    }
}