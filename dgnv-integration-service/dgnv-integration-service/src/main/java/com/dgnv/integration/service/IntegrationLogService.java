package com.dgnv.integration.service;

import com.dgnv.integration.dto.IntegrationLogResponse;
import com.dgnv.integration.entity.IntegrationLog;
import com.dgnv.integration.repository.IntegrationLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IntegrationLogService {

    private final IntegrationLogRepository integrationLogRepository;

    public IntegrationLogService(IntegrationLogRepository integrationLogRepository) {
        this.integrationLogRepository = integrationLogRepository;
    }

    public void save(
            Long requestId,
            String sourceSystem,
            String destinationSystem,
            String status,
            String message,
            String action) {

        IntegrationLog log = IntegrationLog.builder()
                .requestId(requestId)
                .sourceSystem(sourceSystem)
                .destinationSystem(destinationSystem)
                .status(status)
                .message(message)
                .action(action)
                .createdAt(LocalDateTime.now())
                .build();

        integrationLogRepository.save(log);
    }

    public List<IntegrationLogResponse> findByRequestId(Long requestId) {
        return integrationLogRepository.findByRequestIdOrderByCreatedAtDesc(requestId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private IntegrationLogResponse toResponse(IntegrationLog log) {
        return new IntegrationLogResponse(
                log.getId(),
                log.getRequestId(),
                log.getSourceSystem(),
                log.getDestinationSystem(),
                log.getStatus(),
                log.getMessage(),
                log.getAction(),
                log.getCreatedAt()
        );
    }
}
