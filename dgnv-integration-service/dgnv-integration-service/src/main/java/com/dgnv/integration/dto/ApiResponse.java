package com.dgnv.integration.dto;

import java.time.LocalDateTime;

public record ApiResponse(
        String status,
        String message,
        LocalDateTime timestamp
) {

    public static ApiResponse success(String message) {
        return new ApiResponse("SUCCESS", message, LocalDateTime.now());
    }

    public static ApiResponse failed(String message) {
        return new ApiResponse("FAILED", message, LocalDateTime.now());
    }
}
