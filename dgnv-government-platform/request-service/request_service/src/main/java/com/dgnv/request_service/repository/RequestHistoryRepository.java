package com.dgnv.request_service.repository;

import com.dgnv.request_service.entity.RequestHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestHistoryRepository
        extends JpaRepository<RequestHistory, Long> {

    List<RequestHistory> findByRequestId(Long requestId);
}