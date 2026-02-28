package com.habitquest.service;

import com.habitquest.entity.User;
import com.habitquest.entity.XPLog;
import com.habitquest.repository.UserRepository;
import com.habitquest.repository.XPLogRepository;
import com.habitquest.util.RankUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class XPService {

    private final UserRepository userRepository;
    private final XPLogRepository xpLogRepository;

    @Transactional
    public int addXP(Long userId, int amount, String reason) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        int oldXP = user.getXp();
        int newXP = Math.max(0, oldXP + amount);
        user.setXp(newXP);
        user.setRank(RankUtil.getRankForXP(newXP));
        userRepository.save(user);
        xpLogRepository.save(XPLog.builder()
                .user(user)
                .amount(amount)
                .type(XPLog.XPType.GAIN)
                .reason(reason)
                .build());
        return user.getXp();
    }

    @Transactional
    public int subtractXP(Long userId, int amount, String reason) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        int oldXP = user.getXp();
        int newXP = Math.max(0, oldXP - amount);
        user.setXp(newXP);
        user.setRank(RankUtil.getRankForXP(newXP));
        userRepository.save(user);
        xpLogRepository.save(XPLog.builder()
                .user(user)
                .amount(-amount)
                .type(XPLog.XPType.LOSS)
                .reason(reason)
                .build());
        return user.getXp();
    }

    public List<com.habitquest.dto.XPLogDto> getXPHistory(Long userId, int limit) {
        return xpLogRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, limit))
                .stream()
                .map(log -> com.habitquest.dto.XPLogDto.builder()
                        .id(log.getId())
                        .amount(log.getAmount())
                        .type(log.getType().name())
                        .reason(log.getReason())
                        .createdAt(log.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
