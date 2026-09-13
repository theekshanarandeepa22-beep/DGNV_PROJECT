package com.dgnv.integration.service;

import com.dgnv.integration.client.GovernmentRequestClient;
import com.dgnv.integration.client.NgoRequestClient;
import com.dgnv.integration.dto.ForwardResultResponse;
import com.dgnv.integration.dto.GovernmentRequestResponse;
import com.dgnv.integration.dto.NgoReceiveRequest;
import com.dgnv.integration.exception.ExternalServiceException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class IntegrationService {

    private final GovernmentRequestClient governmentRequestClient;
    private final NgoRequestClient ngoRequestClient;
    private final RequestTrackingService requestTrackingService;
    private final IntegrationLogService integrationLogService;

    public IntegrationService(
            GovernmentRequestClient governmentRequestClient,
            NgoRequestClient ngoRequestClient,
            RequestTrackingService requestTrackingService,
            IntegrationLogService integrationLogService) {

        this.governmentRequestClient = governmentRequestClient;
        this.ngoRequestClient = ngoRequestClient;
        this.requestTrackingService = requestTrackingService;
        this.integrationLogService = integrationLogService;
    }

    public ForwardResultResponse forwardApprovedRequestToNgo(Long governmentRequestId) {
        integrationLogService.save(
                governmentRequestId,
                "GOVERNMENT_REQUEST_SERVICE",
                "INTEGRATION_SERVICE",
                "STARTED",
                "Forward approved request workflow started",
                "FORWARD_TO_NGO"
        );

        GovernmentRequestResponse governmentRequest =
                governmentRequestClient.getRequestById(governmentRequestId);

        if (governmentRequest == null) {
            throw new ExternalServiceException(
                    "Government Request Service returned an empty response",
                    null
            );
        }

        if (!"APPROVED".equalsIgnoreCase(governmentRequest.status())
                && !"SENT_TO_NGO".equalsIgnoreCase(governmentRequest.status())) {

            integrationLogService.save(
                    governmentRequestId,
                    "INTEGRATION_SERVICE",
                    "NGO_REQUEST_SERVICE",
                    "FAILED",
                    "Request is not approved. Current status: " + governmentRequest.status(),
                    "FORWARD_TO_NGO"
            );

            throw new ExternalServiceException(
                    "Only APPROVED Government requests can be forwarded to NGO. Current status: "
                            + governmentRequest.status(),
                    null
            );
        }

        ngoRequestClient.forwardRequest(NgoReceiveRequest.fromGovernmentRequest(governmentRequest));
        governmentRequestClient.markRequestSentToNgo(governmentRequestId);
        requestTrackingService.createOrUpdateForwardedTracking(governmentRequestId);

        integrationLogService.save(
                governmentRequestId,
                "INTEGRATION_SERVICE",
                "NGO_REQUEST_SERVICE",
                "SUCCESS",
                "Request forwarded to NGO Request Service",
                "FORWARD_TO_NGO"
        );

        return new ForwardResultResponse(
                governmentRequestId,
                "FORWARDED_TO_NGO",
                "Request forwarded to NGO Request Service successfully",
                LocalDateTime.now()
        );
    }
}
