package com.habitquest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BadHabitDto {
    private Long id;
    @NotBlank(message = "Habit name is required")
    private String name;
    @Min(1)
    @Max(1000)
    private int xpPenalty = 30;
}
