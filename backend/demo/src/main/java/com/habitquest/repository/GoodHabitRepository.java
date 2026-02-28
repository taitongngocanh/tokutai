package com.habitquest.repository;

import com.habitquest.entity.GoodHabit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodHabitRepository extends JpaRepository<GoodHabit, Long> {
    List<GoodHabit> findByUserId(Long userId);
}
