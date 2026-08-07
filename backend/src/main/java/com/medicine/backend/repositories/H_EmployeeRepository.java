package com.medicine.backend.repositories;

import com.medicine.backend.models.users.H_Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface H_EmployeeRepository extends JpaRepository<H_Employee, UUID> {
}
