package com.dgnv.integration.client;

import com.dgnv.integration.dto.NgoReceiveRequest;
import com.dgnv.integration.dto.NgoReceiveResponse;
import com.dgnv.integration.exception.ExternalServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class NgoRequestClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public NgoRequestClient(
            RestTemplate restTemplate,
            @Value("${dgnv.services.ngo-request.base-url}") String baseUrl) {

        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public NgoReceiveResponse forwardRequest(NgoReceiveRequest request) {
        try {
            return restTemplate.postForObject(
                    baseUrl + "/api/requests/receive",
                    request,
                    NgoReceiveResponse.class
            );
        } catch (RestClientException exception) {
            throw new ExternalServiceException(
                    "Unable to forward request to NGO Request Service",
                    exception
            );
        }
    }
}
