package com.dgnv.user_service.service;

import com.dgnv.user_service.entity.OfficerProfile;
import com.dgnv.user_service.repository.OfficerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfficerService {

    @Autowired
    private OfficerProfileRepository repository;

    public OfficerProfile createOfficer(OfficerProfile officer) {

        return repository.save(officer);
    }

    public List<OfficerProfile> getAllOfficers() {

        return repository.findAll();
    }

    public OfficerProfile getOfficerById(Long id) {

        return repository.findById(id).orElse(null);
    }

    public OfficerProfile updateOfficer(Long id, OfficerProfile officer) {

        OfficerProfile existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setFullName(officer.getFullName());
        existing.setEmail(officer.getEmail());
        existing.setNicNumber(officer.getNicNumber());
        existing.setDistrict(officer.getDistrict());
        existing.setDsDivision(officer.getDsDivision());
        existing.setGsDivision(officer.getGsDivision());

        return repository.save(existing);
    }

    public String disableOfficer(Long id) {

        OfficerProfile officer = repository.findById(id).orElse(null);

        if (officer == null) {
            return "Officer Not Found";
        }

        officer.setActive(false);

        repository.save(officer);

        return "Officer Disabled Successfully";
    }
    public List<OfficerProfile> findMatchingOfficers(
        String district,
        String dsDivision,
        String gsDivision) {

    return repository.findByDistrictAndDsDivisionAndGsDivisionAndActive(
            district,
            dsDivision,
            gsDivision,
            true
    );
}
}