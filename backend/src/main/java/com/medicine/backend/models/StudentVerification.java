package com.medicine.backend.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "StudentVerificationList")
public class StudentVerification {
    @Id
    private String verificationCode;

    @ManyToOne
    @JoinColumn(name = "university_id", nullable = false)
    private University university;
    private LocalDateTime createdAt;

    public StudentVerification() {}

    public StudentVerification(String verificationCode, University university){
        this.verificationCode = verificationCode;
        this.university = university;
    }

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }

    public String getVerificationCode() { return verificationCode; }

    public void setUniversity(University university) { this.university = university; }
    public University getUniversity() { return university; }
}
