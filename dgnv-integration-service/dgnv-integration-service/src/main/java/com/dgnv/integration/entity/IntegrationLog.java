package com.dgnv.integration.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "integration_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class IntegrationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id")
    private Long requestId;

    @Column(name = "source_system")
    private String sourceSystem;

    @Column(name = "destination_system")
    private String destinationSystem;

    @Column(name = "status")
    private String status;

    @Column(name = "message")
    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "action")
    private String action;

}
