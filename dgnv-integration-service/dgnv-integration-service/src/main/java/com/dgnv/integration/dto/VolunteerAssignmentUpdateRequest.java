package com.dgnv.integration.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VolunteerAssignmentUpdateRequest(
        @NotNull
        @JsonAlias({"government_request_id", "governmentRequestId"})
        Long governmentRequestId,

        @JsonAlias({"ngo_name", "ngoName"})
        String ngoName,

        @JsonAlias({"volunteer_name", "volunteerName"})
        String volunteerName,

        @JsonAlias({"volunteer_phone", "volunteerPhone"})
        String volunteerPhone,

        @JsonAlias({"volunteer_whatsapp", "volunteerWhatsapp"})
        String volunteerWhatsapp,

        @NotBlank
        String status
) {
}
