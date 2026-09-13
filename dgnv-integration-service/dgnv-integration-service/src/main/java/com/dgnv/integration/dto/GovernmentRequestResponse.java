package com.dgnv.integration.dto;

public record GovernmentRequestResponse(
        Long id,
        Long citizenId,
        String title,
        String description,
        String contactNumber,
        String whatsappNumber,
        String category,
        String district,
        String dsDivision,
        String gsDivision,
        String status,
        Long claimedByOfficerId,
        String priority,
        String officerNote
) {
}
