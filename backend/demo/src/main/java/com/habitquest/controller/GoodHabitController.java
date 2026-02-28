package com.habitquest.controller;

import com.habitquest.dto.GoodHabitDto;
import com.habitquest.service.GoodHabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits/good")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GoodHabitController {

    private final GoodHabitService goodHabitService;

    @GetMapping
    public ResponseEntity<List<GoodHabitDto>> getHabits(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(goodHabitService.getHabitsByUser(user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<GoodHabitDto> createHabit(@AuthenticationPrincipal UserDetails user,
                                                      @Valid @RequestBody GoodHabitDto dto) {
        return ResponseEntity.ok(goodHabitService.createHabit(user.getUsername(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoodHabitDto> updateHabit(@AuthenticationPrincipal UserDetails user,
                                                    @PathVariable Long id,
                                                    @Valid @RequestBody GoodHabitDto dto) {
        return ResponseEntity.ok(goodHabitService.updateHabit(user.getUsername(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        goodHabitService.deleteHabit(user.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<GoodHabitDto> completeToday(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        return ResponseEntity.ok(goodHabitService.completeToday(user.getUsername(), id));
    }
}
