package com.dgnv.request_service.service;

import com.dgnv.request_service.client.OfficerClient;
import com.dgnv.request_service.dto.DashboardSummary;
import com.dgnv.request_service.dto.OfficerResponse;
import com.dgnv.request_service.dto.ReviewRequest;
import com.dgnv.request_service.entity.Request;
import com.dgnv.request_service.entity.RequestHistory;
import com.dgnv.request_service.repository.RequestHistoryRepository;
import com.dgnv.request_service.repository.RequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {


private final RequestRepository requestRepository;
private final RequestHistoryRepository historyRepository;
private final OfficerClient officerClient;

public RequestService(
        RequestRepository requestRepository,
        RequestHistoryRepository historyRepository,
        OfficerClient officerClient) {

    this.requestRepository = requestRepository;
    this.historyRepository = historyRepository;
    this.officerClient = officerClient;
}

// Create Request + Auto Assign Officer
public Request createRequest(Request request) {

    Request savedRequest = requestRepository.save(request);

    List<OfficerResponse> officers =
            officerClient.findMatchingOfficers(
                    request.getDistrict(),
                    request.getDsDivision(),
                    request.getGsDivision()
            );

    if (!officers.isEmpty()) {

        OfficerResponse officer = officers.get(0);

        savedRequest.setClaimedByOfficerId(
                officer.getUserId()
        );

        savedRequest.setStatus("CLAIMED");

        saveHistory(
                savedRequest.getId(),
                officer.getUserId(),
                "AUTO_ASSIGNED"
        );

        savedRequest = requestRepository.save(savedRequest);
    }

    return savedRequest;
}

// Get All Requests
public List<Request> getAllRequests() {
    return requestRepository.findAll();
}

// Get Request By ID
public Request getRequestById(Long id) {
    return requestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Request not found"));
}

// Claim Request
public Request claimRequest(Long requestId, Long officerId) {

    Request request = requestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    if (!"PENDING".equals(request.getStatus())) {
        throw new RuntimeException("Request already claimed");
    }

    request.setStatus("CLAIMED");
    request.setClaimedByOfficerId(officerId);

    saveHistory(
            requestId,
            officerId,
            "CLAIMED"
    );

    return requestRepository.save(request);
}

// Approve Request
public Request approveRequest(Long requestId) {

    Request request = requestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    request.setStatus("APPROVED");

    saveHistory(
            requestId,
            request.getClaimedByOfficerId(),
            "APPROVED"
    );

    return requestRepository.save(request);
}

// Reject Request
public Request rejectRequest(Long requestId) {

    Request request = requestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    request.setStatus("REJECTED");

    saveHistory(
            requestId,
            request.getClaimedByOfficerId(),
            "REJECTED"
    );

    return requestRepository.save(request);
}

// Send To NGO
public Request sendToNgo(Long requestId) {

    Request request = requestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    request.setStatus("SENT_TO_NGO");

    saveHistory(
            requestId,
            request.getClaimedByOfficerId(),
            "SENT_TO_NGO"
    );

    return requestRepository.save(request);
}

// Review Request
public Request reviewRequest(
        Long requestId,
        ReviewRequest reviewRequest) {

    Request request = requestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

    request.setCategory(reviewRequest.getCategory());
    request.setPriority(reviewRequest.getPriority());
    request.setOfficerNote(reviewRequest.getOfficerNote());

    saveHistory(
            requestId,
            request.getClaimedByOfficerId(),
            "REVIEWED"
    );

    return requestRepository.save(request);
}

// Get Pending Requests
public List<Request> getPendingRequests() {
    return requestRepository.findByStatus("PENDING");
}

// Get Requests By Officer
public List<Request> getRequestsByOfficer(Long officerId) {
    return requestRepository.findByClaimedByOfficerId(officerId);
}

// Get Requests By Citizen
public List<Request> getRequestsByCitizen(Long citizenId) {
    return requestRepository.findByCitizenId(citizenId);
}

// Dashboard Counts
public long getPendingCount() {
    return requestRepository.countByStatus("PENDING");
}

public long getClaimedCount() {
    return requestRepository.countByStatus("CLAIMED");
}

public long getApprovedCount() {
    return requestRepository.countByStatus("APPROVED");
}

public long getRejectedCount() {
    return requestRepository.countByStatus("REJECTED");
}

public long getNgoCount() {
    return requestRepository.countByStatus("SENT_TO_NGO");
}

// Dashboard Summary
public DashboardSummary getDashboardSummary() {

    return new DashboardSummary(
            requestRepository.count(),
            requestRepository.countByStatus("PENDING"),
            requestRepository.countByStatus("CLAIMED"),
            requestRepository.countByStatus("APPROVED"),
            requestRepository.countByStatus("REJECTED"),
            requestRepository.countByStatus("SENT_TO_NGO")
    );
}

// Save History
private void saveHistory(
        Long requestId,
        Long officerId,
        String action) {

    RequestHistory history = new RequestHistory();

    history.setRequestId(requestId);
    history.setOfficerId(officerId);
    history.setAction(action);

    historyRepository.save(history);
}


}
