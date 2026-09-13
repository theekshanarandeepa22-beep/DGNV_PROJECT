package com.dgnv.request_service.repository;

import com.dgnv.request_service.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByStatus(String status);

    List<Request> findByClaimedByOfficerId(Long officerId);
    List<Request> findByCitizenId(Long citizenId);
    long countByStatus(String status);
}