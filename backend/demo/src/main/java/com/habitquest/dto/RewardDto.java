package com.habitquest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RewardDto {
    private Long id;
    @NotBlank(message = "Reward name is required")
    private String name;
    @Min(1)
    private int xpCost;
}
