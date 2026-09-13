package com.dgnv.request_service.dto;

public class DashboardSummary {

    private long totalRequests;
    private long pending;
    private long claimed;
    private long approved;
    private long rejected;
    private long sentToNgo;

    public DashboardSummary() {
    }

    public DashboardSummary(long totalRequests,
                            long pending,
                            long claimed,
                            long approved,
                            long rejected,
                            long sentToNgo) {
        this.totalRequests = totalRequests;
        this.pending = pending;
        this.claimed = claimed;
        this.approved = approved;
        this.rejected = rejected;
        this.sentToNgo = sentToNgo;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getClaimed() {
        return claimed;
    }

    public void setClaimed(long claimed) {
        this.claimed = claimed;
    }

    public long getApproved() {
        return approved;
    }

    public void setApproved(long approved) {
        this.approved = approved;
    }

    public long getRejected() {
        return rejected;
    }

    public void setRejected(long rejected) {
        this.rejected = rejected;
    }

    public long getSentToNgo() {
        return sentToNgo;
    }

    public void setSentToNgo(long sentToNgo) {
        this.sentToNgo = sentToNgo;
    }
}