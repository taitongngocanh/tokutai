package com.habitquest.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "good_habits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodHabit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private int xpReward = 50;

    @Column(name = "last_completed_date")
    private LocalDate lastCompletedDate;

    public boolean isCompletedToday() {
        return lastCompletedDate != null && lastCompletedDate.equals(LocalDate.now());
    }
}
