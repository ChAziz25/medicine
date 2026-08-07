package com.medicine.backend.models.users;

import com.medicine.backend.models.University;
import jakarta.persistence.*;

@Entity
@Table(name = "Students")
public class Student extends User {
    @ManyToOne
    @JoinColumn(name = "universityId")
    private University university;

    public Student() {}

    public Student(String name, String email, String password) {
        super(name, email, password);
    }

    public void setUniversity(University university) { this.university = university; }
    public University getUniversity() { return university; }
}
