package com.habitquest.repository;

import com.habitquest.entity.XPLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XPLogRepository extends JpaRepository<XPLog, Long> {
    List<XPLog> findByUserIdOrderByCreatedAtDesc(Long userId, org.springframework.data.domain.Pageable pageable);
}
