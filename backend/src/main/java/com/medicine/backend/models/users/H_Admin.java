package com.medicine.backend.models.users;

import com.medicine.backend.models.Hospital;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Hospitals_Admins")
public class H_Admin extends User{
    @ManyToOne
    @JoinColumn(name = "hospitalId")
    private Hospital hospital;

    public H_Admin() {}
    public H_Admin(String name, String email, String password, Hospital hospital) {
        super(name, email, password);
        this.hospital = hospital;
    }

    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    public Hospital getHospital() { return hospital; }
}
