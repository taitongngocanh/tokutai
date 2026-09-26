package com.habitquest.repository;

import com.habitquest.entity.BadHabitViolation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BadHabitViolationRepository extends JpaRepository<BadHabitViolation, Long> {
    List<BadHabitViolation> findByBadHabitUserIdAndViolatedAtBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}
