package com.dgnv.integration.controller;

import com.dgnv.integration.dto.RequestTrackingResponse;
import com.dgnv.integration.dto.VolunteerAssignmentUpdateRequest;
import com.dgnv.integration.service.RequestTrackingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/integration/ngo")
public class NgoCallbackController {

    private final RequestTrackingService requestTrackingService;

    public NgoCallbackController(RequestTrackingService requestTrackingService) {
        this.requestTrackingService = requestTrackingService;
    }

    @PostMapping("/assignment-updates")
    public RequestTrackingResponse receiveVolunteerAssignmentUpdate(
            @Valid @RequestBody VolunteerAssignmentUpdateRequest request) {

        return requestTrackingService.updateVolunteerAssignment(request);
    }
}
