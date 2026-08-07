package com.medicine.backend.models.users;

import com.medicine.backend.models.Hospital;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Hospitals_Employees")
public class H_Employee extends User{
    @ManyToOne
    @JoinColumn(name = "hospitalId")
    private Hospital hospital;

    public H_Employee() {}

    public H_Employee(String name, String email, String password, Hospital hospital) {
        super(name, email, password);
        this.hospital = hospital;
    }

    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    public Hospital getHospital() { return hospital; }
}
