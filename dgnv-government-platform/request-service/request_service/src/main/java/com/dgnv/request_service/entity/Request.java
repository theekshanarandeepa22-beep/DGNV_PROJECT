package com.dgnv.request_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long citizenId;

    private String title;

    @Column(length = 2000)
    private String description;

    private String contactNumber;

    private String whatsappNumber;

    private String category;

    private String district;

    private String dsDivision;

    private String gsDivision;

    private String status;

    private Long claimedByOfficerId;

    private LocalDateTime createdAt;
    private String  priority;

@Column(length = 2000)
private String officerNote;

    public Request() {
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getDsDivision() { return dsDivision; }
    public void setDsDivision(String dsDivision) { this.dsDivision = dsDivision; }

    public String getGsDivision() { return gsDivision; }
    public void setGsDivision(String gsDivision) { this.gsDivision = gsDivision; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getClaimedByOfficerId() { return claimedByOfficerId; }
    public void setClaimedByOfficerId(Long claimedByOfficerId) {
     
        this.claimedByOfficerId = claimedByOfficerId;
    }
    public String getPriority() {
    return priority;
}

public void setPriority(String priority) {
    this.priority = priority;
}

public String getOfficerNote() {
    return officerNote;
}

public void setOfficerNote(String officerNote) {
    this.officerNote = officerNote;
}

    public LocalDateTime getCreatedAt() { return createdAt; }
}