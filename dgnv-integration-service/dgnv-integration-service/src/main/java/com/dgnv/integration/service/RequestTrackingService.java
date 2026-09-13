package com.dgnv.integration.service;

import com.dgnv.integration.dto.RequestTrackingResponse;
import com.dgnv.integration.dto.VolunteerAssignmentUpdateRequest;
import com.dgnv.integration.entity.RequestTracking;
import com.dgnv.integration.exception.ResourceNotFoundException;
import com.dgnv.integration.repository.RequestTrackingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RequestTrackingService {

    private final RequestTrackingRepository requestTrackingRepository;
    private final IntegrationLogService integrationLogService;

    public RequestTrackingService(
            RequestTrackingRepository requestTrackingRepository,
            IntegrationLogService integrationLogService) {

        this.requestTrackingRepository = requestTrackingRepository;
        this.integrationLogService = integrationLogService;
    }

    public RequestTracking createOrUpdateForwardedTracking(Long governmentRequestId) {
        RequestTracking tracking = requestTrackingRepository
                .findByGovernmentRequestId(governmentRequestId)
                .orElseGet(RequestTracking::new);

        tracking.setGovernmentRequestId(governmentRequestId);
        tracking.setStatus("FORWARDED_TO_NGO");
        tracking.setUpdatedAt(LocalDateTime.now());

        return requestTrackingRepository.save(tracking);
    }

    public RequestTrackingResponse updateVolunteerAssignment(VolunteerAssignmentUpdateRequest request) {
        RequestTracking tracking = requestTrackingRepository
                .findByGovernmentRequestId(request.governmentRequestId())
                .orElseGet(RequestTracking::new);

        tracking.setGovernmentRequestId(request.governmentRequestId());
        tracking.setNgoName(request.ngoName());
        tracking.setVolunteerName(request.volunteerName());
        tracking.setVolunteerPhone(request.volunteerPhone());
        tracking.setVolunteerWhatsapp(request.volunteerWhatsapp());
        tracking.setStatus(request.status());
        tracking.setUpdatedAt(LocalDateTime.now());

        RequestTracking savedTracking = requestTrackingRepository.save(tracking);

        integrationLogService.save(
                request.governmentRequestId(),
                "NGO_REQUEST_SERVICE",
                "INTEGRATION_SERVICE",
                "SUCCESS",
                "Volunteer assignment/status update received",
                request.status()
        );

        return toResponse(savedTracking);
    }

    public RequestTrackingResponse getTracking(Long governmentRequestId) {
        return requestTrackingRepository.findByGovernmentRequestId(governmentRequestId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No tracking record found for government request id " + governmentRequestId
                ));
    }

    public RequestTrackingResponse toResponse(RequestTracking tracking) {
        return new RequestTrackingResponse(
                tracking.getId(),
                tracking.getGovernmentRequestId(),
                tracking.getNgoName(),
                tracking.getVolunteerName(),
                tracking.getVolunteerPhone(),
                tracking.getVolunteerWhatsapp(),
                tracking.getStatus(),
                tracking.getUpdatedAt()
        );
    }
}
