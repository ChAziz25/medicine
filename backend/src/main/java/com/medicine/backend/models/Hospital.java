package com.medicine.backend.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Hospitals")
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String address;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Hospital() {}
    public Hospital(String name) { this.name = name; }

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public UUID getId() { return id; }

    public void setName(String name) { this.name = name; }
    public String getName() { return name; }

    public void setAddress(String address) {this.address = address; }
    public String getAddress() { return address; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
