package com.habitquest.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bad_habit_violations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BadHabitViolation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bad_habit_id", nullable = false)
    private BadHabit badHabit;

    @CreationTimestamp
    private LocalDateTime violatedAt;
}
