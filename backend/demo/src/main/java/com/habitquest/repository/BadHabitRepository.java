package com.habitquest.repository;

import com.habitquest.entity.BadHabit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BadHabitRepository extends JpaRepository<BadHabit, Long> {
    List<BadHabit> findByUserId(Long userId);
}
