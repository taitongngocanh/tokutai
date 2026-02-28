package com.habitquest.controller;

import com.habitquest.dto.PurchaseHistoryDto;
import com.habitquest.dto.RewardDto;
import com.habitquest.service.RewardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<List<RewardDto>> getRewards(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(rewardService.getRewardsByUser(user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<RewardDto> createReward(@AuthenticationPrincipal UserDetails user,
                                                  @Valid @RequestBody RewardDto dto) {
        return ResponseEntity.ok(rewardService.createReward(user.getUsername(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RewardDto> updateReward(@AuthenticationPrincipal UserDetails user,
                                                  @PathVariable Long id,
                                                  @Valid @RequestBody RewardDto dto) {
        return ResponseEntity.ok(rewardService.updateReward(user.getUsername(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReward(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        rewardService.deleteReward(user.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<PurchaseHistoryDto> purchaseReward(@AuthenticationPrincipal UserDetails user,
                                                             @PathVariable Long id) {
        return ResponseEntity.ok(rewardService.purchaseReward(user.getUsername(), id));
    }

    @GetMapping("/history")
    public ResponseEntity<List<PurchaseHistoryDto>> getPurchaseHistory(@AuthenticationPrincipal UserDetails user,
                                                                      @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(rewardService.getPurchaseHistory(user.getUsername(), limit));
    }
}
