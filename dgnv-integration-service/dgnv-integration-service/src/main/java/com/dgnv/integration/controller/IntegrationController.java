package com.dgnv.integration.controller;

import com.dgnv.integration.dto.ForwardResultResponse;
import com.dgnv.integration.dto.IntegrationLogResponse;
import com.dgnv.integration.dto.RequestTrackingResponse;
import com.dgnv.integration.service.IntegrationLogService;
import com.dgnv.integration.service.IntegrationService;
import com.dgnv.integration.service.RequestTrackingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/integration/requests")
public class IntegrationController {

    private final IntegrationService integrationService;
    private final RequestTrackingService requestTrackingService;
    private final IntegrationLogService integrationLogService;

    public IntegrationController(
            IntegrationService integrationService,
            RequestTrackingService requestTrackingService,
            IntegrationLogService integrationLogService) {

        this.integrationService = integrationService;
        this.requestTrackingService = requestTrackingService;
        this.integrationLogService = integrationLogService;
    }

    @PostMapping("/{governmentRequestId}/forward-to-ngo")
    public ForwardResultResponse forwardApprovedRequestToNgo(
            @PathVariable Long governmentRequestId) {

        return integrationService.forwardApprovedRequestToNgo(governmentRequestId);
    }

    @GetMapping("/{governmentRequestId}/tracking")
    public RequestTrackingResponse getTracking(
            @PathVariable Long governmentRequestId) {

        return requestTrackingService.getTracking(governmentRequestId);
    }

    @GetMapping("/{governmentRequestId}/logs")
    public List<IntegrationLogResponse> getLogs(
            @PathVariable Long governmentRequestId) {

        return integrationLogService.findByRequestId(governmentRequestId);
    }
}
