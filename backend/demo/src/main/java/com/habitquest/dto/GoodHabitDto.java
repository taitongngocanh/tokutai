package com.habitquest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GoodHabitDto {
    private Long id;
    @NotBlank(message = "Habit name is required")
    private String name;
    @Min(1)
    private int xpReward = 50;
    private LocalDate lastCompletedDate;
    private boolean completedToday;
}
