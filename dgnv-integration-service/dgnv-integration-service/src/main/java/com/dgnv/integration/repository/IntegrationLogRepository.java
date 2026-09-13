package com.dgnv.integration.repository;

import com.dgnv.integration.entity.IntegrationLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IntegrationLogRepository extends JpaRepository<IntegrationLog, Long> {

    List<IntegrationLog> findByRequestIdOrderByCreatedAtDesc(Long requestId);
}
