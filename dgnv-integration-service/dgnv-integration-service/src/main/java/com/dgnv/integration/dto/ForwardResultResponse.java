package com.dgnv.integration.dto;

import java.time.LocalDateTime;

public record ForwardResultResponse(
        Long governmentRequestId,
        String status,
        String message,
        LocalDateTime forwardedAt
) {
}
