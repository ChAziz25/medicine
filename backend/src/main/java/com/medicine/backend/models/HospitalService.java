package com.medicine.backend.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "HospitalServices",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"hospital_id", "service_id"}
                )
        }
)
public class HospitalService {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    private int capacity;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;



    public HospitalService() {}

    public HospitalService(Hospital hospital, Service service) {
        this.hospital = hospital;
        this.service = service;
    }

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public UUID getId() { return id; }

    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }

    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
