package com.habitquest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "good_habit_completions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"good_habit_id", "date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodHabitCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "good_habit_id", nullable = false)
    private GoodHabit goodHabit;

    @Column(nullable = false)
    private LocalDate date;
}
