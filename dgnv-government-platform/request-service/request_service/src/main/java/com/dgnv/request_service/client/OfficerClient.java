package com.dgnv.request_service.client;

import com.dgnv.request_service.dto.OfficerResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "USER-SERVICE")
public interface OfficerClient {

    @GetMapping("/officers/search")
    List<OfficerResponse> findMatchingOfficers(
            @RequestParam String district,
            @RequestParam String dsDivision,
            @RequestParam String gsDivision
    );
}