package com.habitquest.controller;

import com.habitquest.dto.BadHabitDto;
import com.habitquest.service.BadHabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits/bad")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BadHabitController {

    private final BadHabitService badHabitService;

    @GetMapping
    public ResponseEntity<List<BadHabitDto>> getHabits(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(badHabitService.getHabitsByUser(user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<BadHabitDto> createHabit(@AuthenticationPrincipal UserDetails user,
                                                   @Valid @RequestBody BadHabitDto dto) {
        return ResponseEntity.ok(badHabitService.createHabit(user.getUsername(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BadHabitDto> updateHabit(@AuthenticationPrincipal UserDetails user,
                                                   @PathVariable Long id,
                                                   @Valid @RequestBody BadHabitDto dto) {
        return ResponseEntity.ok(badHabitService.updateHabit(user.getUsername(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        badHabitService.deleteHabit(user.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/violate")
    public ResponseEntity<BadHabitDto> recordViolation(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        return ResponseEntity.ok(badHabitService.recordViolation(user.getUsername(), id));
    }

    @GetMapping("/history")
    public ResponseEntity<List<com.habitquest.entity.BadHabitViolation>> getHistory(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(badHabitService.getAllViolationsForUser(
                user.getUsername(), 
                java.time.LocalDateTime.parse(startDate + "T00:00:00"), 
                java.time.LocalDateTime.parse(endDate + "T23:59:59")));
    }
}
