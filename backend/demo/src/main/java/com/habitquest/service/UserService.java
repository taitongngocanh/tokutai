package com.habitquest.service;

import com.habitquest.dto.DashboardResponse;
import com.habitquest.entity.User;
import com.habitquest.repository.GoodHabitRepository;
import com.habitquest.repository.UserRepository;
import com.habitquest.util.RankUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final GoodHabitRepository goodHabitRepository;

    public DashboardResponse getDashboard(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        long completedCount = goodHabitRepository.findByUserId(user.getId()).stream()
                .filter(h -> h.getLastCompletedDate() != null)
                .count();
        int xpProgress = RankUtil.getXPProgress(user.getXp());
        int xpForCurrentRank = RankUtil.getXPForCurrentRank(user.getXp());
        int xpForNextRank = RankUtil.getXPForNextRank(user.getXp());
        return DashboardResponse.builder()
                .username(user.getUsername())
                .xp(user.getXp())
                .rank(user.getRank())
                .xpProgress(xpProgress)
                .xpForCurrentRank(xpForCurrentRank)
                .xpForNextRank(xpForNextRank)
                .totalCompletedHabits(completedCount)
                .rankUp(false)
                .build();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
