package com.dgnv.user_service.repository;

import com.dgnv.user_service.entity.CitizenProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitizenProfileRepository
        extends JpaRepository<CitizenProfile, Long> {

    CitizenProfile findByUserId(Long userId);
}