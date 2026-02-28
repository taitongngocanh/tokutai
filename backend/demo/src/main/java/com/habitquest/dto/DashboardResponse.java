package com.habitquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private String username;
    private int xp;
    private String rank;
    private int xpProgress; // 0-100 percentage toward next rank
    private int xpForCurrentRank;
    private int xpForNextRank;
    private long totalCompletedHabits;
    private boolean rankUp; // true if user just ranked up (for confetti)
}
