package com.dgnv.integration.dto;

import java.time.LocalDateTime;

public record RequestTrackingResponse(
        Long id,
        Long governmentRequestId,
        String ngoName,
        String volunteerName,
        String volunteerPhone,
        String volunteerWhatsapp,
        String status,
        LocalDateTime updatedAt
) {
}
