package com.dgnv.user_service.service;

import com.dgnv.user_service.entity.CitizenProfile;
import com.dgnv.user_service.repository.CitizenProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CitizenService {

    @Autowired
    private CitizenProfileRepository repository;

    public CitizenProfile createCitizen(CitizenProfile citizen) {
        return repository.save(citizen);
    }

    public List<CitizenProfile> getAllCitizens() {
        return repository.findAll();
    }

    public CitizenProfile getCitizenById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public CitizenProfile updateCitizen(Long id, CitizenProfile citizen) {

        CitizenProfile existing =
                repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setFullName(citizen.getFullName());
        existing.setEmail(citizen.getEmail());
        existing.setDistrict(citizen.getDistrict());
        existing.setDsDivision(citizen.getDsDivision());
        existing.setGsDivision(citizen.getGsDivision());

        return repository.save(existing);
    }

    public String disableCitizen(Long id) {

        CitizenProfile citizen =
                repository.findById(id).orElse(null);

        if (citizen == null) {
            return "Citizen Not Found";
        }

        citizen.setActive(false);

        repository.save(citizen);

        return "Citizen Disabled Successfully";
    }
       public CitizenProfile getCitizenByUserId(Long userId) {

    return repository.findByUserId(userId);
}
}
