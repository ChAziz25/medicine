package com.medicine.backend.models.users;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Admins")
public class Admin extends User{
    public Admin() {}

    public Admin(String name, String email, String password) {
        super(name, email, password);
    }
}
