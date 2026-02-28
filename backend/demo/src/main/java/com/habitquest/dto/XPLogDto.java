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
public class XPLogDto {
    private Long id;
    private int amount;
    private String type; // GAIN, LOSS
    private String reason;
    private LocalDateTime createdAt;
}
