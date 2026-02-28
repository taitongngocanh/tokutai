package com.habitquest.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bad_habits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BadHabit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private int xpPenalty = 30;

    @OneToMany(mappedBy = "badHabit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BadHabitViolation> violations = new ArrayList<>();
}
