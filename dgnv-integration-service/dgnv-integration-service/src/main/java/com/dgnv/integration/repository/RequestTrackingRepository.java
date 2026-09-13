package com.dgnv.integration.repository;

import com.dgnv.integration.entity.RequestTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RequestTrackingRepository extends JpaRepository<RequestTracking, Long> {

    Optional<RequestTracking> findByGovernmentRequestId(Long governmentRequestId);
}
