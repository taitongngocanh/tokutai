package com.habitquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseHistoryDto {
    private Long id;
    private String rewardName;
    private int xpCost;
    private LocalDateTime purchasedAt;
}
