package com.medicine.backend.models.users;

import com.medicine.backend.models.University;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Universities_Admins")
public class Uni_Admin extends User {
    @ManyToOne
    @JoinColumn(name = "universityId")
    private University university;

    public Uni_Admin() {}

    public Uni_Admin(String name, String email, String password, University university) {
        super(name, email, password);
        this.university = university;
    }

    public void setUniversity(University university) { this.university = university; }
    public University getUniversity() { return university; }
}
