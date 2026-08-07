package com.medicine.backend.repositories;

import com.medicine.backend.models.HospitalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HospitalServiceRepository extends JpaRepository<HospitalService, UUID> {
}
