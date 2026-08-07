package com.medicine.backend.repositories;

import com.medicine.backend.models.users.H_Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface H_AdminRepository extends JpaRepository<H_Admin, UUID> {
}
