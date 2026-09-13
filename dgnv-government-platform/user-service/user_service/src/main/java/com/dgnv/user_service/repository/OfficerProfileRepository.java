package com.dgnv.user_service.repository;

import com.dgnv.user_service.entity.OfficerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfficerProfileRepository extends JpaRepository<OfficerProfile, Long> {

    List<OfficerProfile> findByDistrictAndDsDivisionAndGsDivisionAndActive(
            String district,
            String dsDivision,
            String gsDivision,
            Boolean active
    );
}