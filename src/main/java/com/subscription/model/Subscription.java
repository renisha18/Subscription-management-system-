package com.subscription.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Subscriber name is required")
    @Column(name = "subscriber_name", nullable = false, length = 100)
    private String subscriberName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Plan type is required")
    @Column(name = "plan_type", nullable = false, length = 50)
    private String planType;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(length = 50)
    private String status = "Active";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSubscriberName() { return subscriberName; }
    public void setSubscriberName(String s) { this.subscriberName = s; }
    public String getEmail() { return email; }
    public void setEmail(String e) { this.email = e; }
    public String getPlanType() { return planType; }
    public void setPlanType(String p) { this.planType = p; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate d) { this.startDate = d; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate d) { this.endDate = d; }
    public String getStatus() { return status; }
    public void setStatus(String s) { this.status = s; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }
}
