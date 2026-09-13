package com.dgnv.user_service.controller;

import com.dgnv.user_service.entity.OfficerProfile;
import com.dgnv.user_service.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/officers")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    @PostMapping
    public OfficerProfile createOfficer(
            @RequestBody OfficerProfile officer) {

        return officerService.createOfficer(officer);
    }

    @GetMapping
    public List<OfficerProfile> getAllOfficers() {

        return officerService.getAllOfficers();
    }

    @GetMapping("/{id}")
    public OfficerProfile getOfficerById(
            @PathVariable Long id) {

        return officerService.getOfficerById(id);
    }

    @PutMapping("/{id}")
    public OfficerProfile updateOfficer(
            @PathVariable Long id,
            @RequestBody OfficerProfile officer) {

        return officerService.updateOfficer(id, officer);
    }

    @DeleteMapping("/{id}")
    public String disableOfficer(
            @PathVariable Long id) {

        return officerService.disableOfficer(id);
    }
    @GetMapping("/search")
public List<OfficerProfile> findMatchingOfficers(
        @RequestParam String district,
        @RequestParam String dsDivision,
        @RequestParam String gsDivision) {

    return officerService.findMatchingOfficers(
            district,
            dsDivision,
            gsDivision
    );
}
}