package com.dgnv.integration.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "request_tracking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RequestTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "government_request_id")
    private Long governmentRequestId;

    @Column(name = "ngo_name")
    private String ngoName;

    @Column(name = "volunteer_name")
    private String volunteerName;

    @Column(name = "volunteer_phone")
    private String volunteerPhone;

    @Column(name = "volunteer_whatsapp")
    private String volunteerWhatsapp;

    @Column(name = "status")
    private String status;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}