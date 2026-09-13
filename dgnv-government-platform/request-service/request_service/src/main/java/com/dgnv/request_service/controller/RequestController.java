package com.dgnv.request_service.controller;

import com.dgnv.request_service.dto.DashboardSummary;
import com.dgnv.request_service.dto.ReviewRequest;
import com.dgnv.request_service.entity.Request;
import com.dgnv.request_service.entity.RequestHistory;
import com.dgnv.request_service.repository.RequestHistoryRepository;
import com.dgnv.request_service.service.RequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
public class RequestController {

    private final RequestService requestService;
    private final RequestHistoryRepository historyRepository;

    public RequestController(
            RequestService requestService,
            RequestHistoryRepository historyRepository) {

        this.requestService = requestService;
        this.historyRepository = historyRepository;
    }

    // Create Request
    @PostMapping
    public Request createRequest(@RequestBody Request request) {
        return requestService.createRequest(request);
    }

    // Get All Requests
    @GetMapping
    public List<Request> getAllRequests() {
        return requestService.getAllRequests();
    }

    // Get Request By ID
    @GetMapping("/{id}")
    public Request getRequestById(@PathVariable Long id) {
        return requestService.getRequestById(id);
    }

    // Claim Request
    @PostMapping("/{requestId}/claim/{officerId}")
    public Request claimRequest(
            @PathVariable Long requestId,
            @PathVariable Long officerId) {

        return requestService.claimRequest(requestId, officerId);
    }

    // Approve Request
    @PostMapping("/{id}/approve")
    public Request approveRequest(@PathVariable Long id) {
        return requestService.approveRequest(id);
    }

    // Reject Request
    @PostMapping("/{id}/reject")
    public Request rejectRequest(@PathVariable Long id) {
        return requestService.rejectRequest(id);
    }

    // Send To NGO
    @PostMapping("/{id}/ngo")
    public Request sendToNgo(@PathVariable Long id) {
        return requestService.sendToNgo(id);
    }

    // Review Request
    @PostMapping("/{id}/review")
    public Request reviewRequest(
            @PathVariable Long id,
            @RequestBody ReviewRequest reviewRequest) {

        return requestService.reviewRequest(id, reviewRequest);
    }

    // Get Pending Requests
    @GetMapping("/pending")
    public List<Request> getPendingRequests() {
        return requestService.getPendingRequests();
    }

    // Get Requests By Officer
    @GetMapping("/officer/{officerId}")
    public List<Request> getRequestsByOfficer(
            @PathVariable Long officerId) {

        return requestService.getRequestsByOfficer(officerId);
    }

    // Get Requests By Citizen
    @GetMapping("/citizen/{citizenId}")
    public List<Request> getRequestsByCitizen(
            @PathVariable Long citizenId) {

        return requestService.getRequestsByCitizen(citizenId);
    }

    // Statistics
    @GetMapping("/stats/pending")
    public long pendingCount() {
        return requestService.getPendingCount();
    }

    @GetMapping("/stats/claimed")
    public long claimedCount() {
        return requestService.getClaimedCount();
    }

    @GetMapping("/stats/approved")
    public long approvedCount() {
        return requestService.getApprovedCount();
    }

    @GetMapping("/stats/rejected")
    public long rejectedCount() {
        return requestService.getRejectedCount();
    }

    @GetMapping("/stats/ngo")
    public long ngoCount() {
        return requestService.getNgoCount();
    }

    // Dashboard Summary
    @GetMapping("/dashboard-summary")
    public DashboardSummary getDashboardSummary() {
        return requestService.getDashboardSummary();
    }

    // Categories
    @GetMapping("/categories")
    public List<String> getCategories() {

        return List.of(
                "Food Support",
                "Water Supply",
                "Medical Assistance",
                "Temporary Shelter",
                "Rescue Services",
                "Clothing Support",
                "Electricity Support",
                "Security Support",
                "Boat Service",
                "Housing Repair"
        );
    }

    // Priorities
    @GetMapping("/priorities")
    public List<String> getPriorities() {

        return List.of(
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
        );
    }

    // Request History
    @GetMapping("/{id}/history")
    public List<RequestHistory> getHistory(
            @PathVariable Long id) {

        return historyRepository.findByRequestId(id);
    }
}
