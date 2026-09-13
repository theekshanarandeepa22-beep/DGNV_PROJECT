package com.dgnv.integration.dto;

import java.time.LocalDateTime;

public record IntegrationLogResponse(
        Long id,
        Long requestId,
        String sourceSystem,
        String destinationSystem,
        String status,
        String message,
        String action,
        LocalDateTime createdAt
) {
}
