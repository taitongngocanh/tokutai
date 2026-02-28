package com.habitquest.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "xp_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XPLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private int amount;

    @Enumerated(EnumType.STRING)
    private XPType type;

    private String reason;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum XPType {
        GAIN,
        LOSS
    }
}
