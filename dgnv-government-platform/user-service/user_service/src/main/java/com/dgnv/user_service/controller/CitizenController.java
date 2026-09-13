package com.dgnv.user_service.controller;

import com.dgnv.user_service.entity.CitizenProfile;
import com.dgnv.user_service.service.CitizenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citizens")
public class CitizenController {

    @Autowired
    private CitizenService citizenService;

    @PostMapping
    public CitizenProfile createCitizen(
            @RequestBody CitizenProfile citizen) {

        return citizenService.createCitizen(citizen);
    }

    @GetMapping
    public List<CitizenProfile> getAllCitizens() {

        return citizenService.getAllCitizens();
    }
    @GetMapping("/user/{userId}")
     public CitizenProfile getCitizenByUserId(
        @PathVariable Long userId) {

    return citizenService.getCitizenByUserId(userId);
}

    @GetMapping("/{id}")
    public CitizenProfile getCitizenById(
            @PathVariable Long id) {

        return citizenService.getCitizenById(id);
    }

    @PutMapping("/{id}")
    public CitizenProfile updateCitizen(
            @PathVariable Long id,
            @RequestBody CitizenProfile citizen) {

        return citizenService.updateCitizen(id, citizen);
    }

    @DeleteMapping("/{id}")
    public String disableCitizen(
            @PathVariable Long id) {

        return citizenService.disableCitizen(id);
    }
}