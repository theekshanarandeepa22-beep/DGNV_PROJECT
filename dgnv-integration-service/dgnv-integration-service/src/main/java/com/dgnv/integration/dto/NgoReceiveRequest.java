package com.dgnv.integration.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NgoReceiveRequest(
        @JsonProperty("government_request_id")
        Long governmentRequestId,

        @JsonProperty("citizen_id")
        Long citizenId,

        String title,
        String description,

        @JsonProperty("contact_number")
        String contactNumber,

        @JsonProperty("whatsapp_number")
        String whatsappNumber,

        String category,
        String priority,
        String district,

        @JsonProperty("ds_division")
        String dsDivision,

        @JsonProperty("gs_division")
        String gsDivision
) {

    public static NgoReceiveRequest fromGovernmentRequest(GovernmentRequestResponse request) {
        return new NgoReceiveRequest(
                request.id(),
                request.citizenId(),
                request.title(),
                request.description(),
                request.contactNumber(),
                request.whatsappNumber(),
                request.category(),
                request.priority(),
                request.district(),
                request.dsDivision(),
                request.gsDivision()
        );
    }
}
