package com.habitquest.repository;

import com.habitquest.entity.GoodHabitCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoodHabitCompletionRepository extends JpaRepository<GoodHabitCompletion, Long> {
    Optional<GoodHabitCompletion> findByGoodHabitIdAndDate(Long goodHabitId, LocalDate date);
    List<GoodHabitCompletion> findByGoodHabitId(Long goodHabitId);
    List<GoodHabitCompletion> findByGoodHabitUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
