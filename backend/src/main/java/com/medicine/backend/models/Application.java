package com.medicine.backend.models;

import com.medicine.backend.models.users.Student;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "Applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"student_id", "hospital_service_id"}
                )
        }
)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "hospital_service_id", nullable = false)
    private HospitalService hospitalService;

    private Status status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Application() {}

    public Application(
            Student student,
            HospitalService hospitalService
    ) {
        this.student = student;
        this.hospitalService = hospitalService;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = Status.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public HospitalService getHospitalService() { return hospitalService; }
    public void setHospitalService(HospitalService hospitalService) { this.hospitalService = hospitalService; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
