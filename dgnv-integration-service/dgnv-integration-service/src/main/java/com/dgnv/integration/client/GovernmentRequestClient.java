package com.dgnv.integration.client;

import com.dgnv.integration.dto.GovernmentRequestResponse;
import com.dgnv.integration.exception.ExternalServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class GovernmentRequestClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public GovernmentRequestClient(
            RestTemplate restTemplate,
            @Value("${dgnv.services.government-request.base-url}") String baseUrl) {

        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public GovernmentRequestResponse getRequestById(Long governmentRequestId) {
        try {
            return restTemplate.getForObject(
                    baseUrl + "/requests/" + governmentRequestId,
                    GovernmentRequestResponse.class
            );
        } catch (RestClientException exception) {
            throw new ExternalServiceException(
                    "Unable to fetch request from Government Request Service",
                    exception
            );
        }
    }

    public GovernmentRequestResponse markRequestSentToNgo(Long governmentRequestId) {
        try {
            return restTemplate.postForObject(
                    baseUrl + "/requests/" + governmentRequestId + "/ngo",
                    null,
                    GovernmentRequestResponse.class
            );
        } catch (RestClientException exception) {
            throw new ExternalServiceException(
                    "Unable to update Government request status to SENT_TO_NGO",
                    exception
            );
        }
    }
}
