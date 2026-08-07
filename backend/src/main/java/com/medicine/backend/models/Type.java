package com.medicine.backend.models;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "Types")
public class Type {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    public Type(){}
    public Type(String name){ this.name = name; }

    public UUID getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
