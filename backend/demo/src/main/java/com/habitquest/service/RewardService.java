package com.habitquest.service;

import com.habitquest.dto.PurchaseHistoryDto;
import com.habitquest.dto.RewardDto;
import com.habitquest.entity.PurchaseHistory;
import com.habitquest.entity.Reward;
import com.habitquest.entity.User;
import com.habitquest.repository.PurchaseHistoryRepository;
import com.habitquest.repository.RewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final PurchaseHistoryRepository purchaseHistoryRepository;
    private final UserService userService;
    private final XPService xpService;

    public List<RewardDto> getRewardsByUser(String username) {
        var user = userService.getUserByUsername(username);
        return rewardRepository.findByUserId(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public RewardDto createReward(String username, RewardDto dto) {
        var user = userService.getUserByUsername(username);
        Reward reward = Reward.builder()
                .user(user)
                .name(dto.getName())
                .xpCost(dto.getXpCost())
                .build();
        reward = rewardRepository.save(reward);
        return toDto(reward);
    }

    public RewardDto updateReward(String username, Long id, RewardDto dto) {
        Reward reward = getRewardForUser(username, id);
        reward.setName(dto.getName());
        reward.setXpCost(dto.getXpCost());
        reward = rewardRepository.save(reward);
        return toDto(reward);
    }

    public void deleteReward(String username, Long id) {
        Reward reward = getRewardForUser(username, id);
        rewardRepository.delete(reward);
    }

    @Transactional
    public PurchaseHistoryDto purchaseReward(String username, Long id) {
        Reward reward = getRewardForUser(username, id);
        User user = reward.getUser();
        if (user.getXp() < reward.getXpCost()) {
            throw new IllegalStateException("Insufficient XP");
        }
        xpService.subtractXP(user.getId(), reward.getXpCost(), "Purchased: " + reward.getName());
        PurchaseHistory ph = PurchaseHistory.builder()
                .user(user)
                .rewardName(reward.getName())
                .xpCost(reward.getXpCost())
                .build();
        ph = purchaseHistoryRepository.save(ph);
        return PurchaseHistoryDto.builder()
                .id(ph.getId())
                .rewardName(ph.getRewardName())
                .xpCost(ph.getXpCost())
                .purchasedAt(ph.getPurchasedAt())
                .build();
    }

    public List<PurchaseHistoryDto> getPurchaseHistory(String username, int limit) {
        var user = userService.getUserByUsername(username);
        return purchaseHistoryRepository.findByUserIdOrderByPurchasedAtDesc(user.getId(), PageRequest.of(0, limit))
                .stream()
                .map(p -> PurchaseHistoryDto.builder()
                        .id(p.getId())
                        .rewardName(p.getRewardName())
                        .xpCost(p.getXpCost())
                        .purchasedAt(p.getPurchasedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private Reward getRewardForUser(String username, Long id) {
        var user = userService.getUserByUsername(username);
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reward not found"));
        if (!reward.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Reward not found");
        }
        return reward;
    }

    private RewardDto toDto(Reward reward) {
        RewardDto dto = new RewardDto();
        dto.setId(reward.getId());
        dto.setName(reward.getName());
        dto.setXpCost(reward.getXpCost());
        return dto;
    }
}
