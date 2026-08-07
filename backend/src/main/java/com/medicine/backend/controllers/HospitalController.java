package com.medicine.backend.controllers;

import com.medicine.backend.models.Hospital;
import com.medicine.backend.repositories.HospitalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("api/hospital")
public class HospitalController {
    public final HospitalRepository hospitalRepository;

    public HospitalController(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    @PostMapping("/createHospital")
    public ResponseEntity<?> createHospital(@RequestBody Map<String, Object> body){
        try {
            String name = body.get("name").toString();

            Hospital hospital = new Hospital(name);
            hospitalRepository.save(hospital);

            return ResponseEntity.ok(Map.of(
                    "message", "Hospital Created",
                    "Hospital name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/listHospitals")
    public ResponseEntity<?> listHospitals(){
        List<Map<String, String>> hospitals = new ArrayList<>();

        for (Hospital h: hospitalRepository.findAll()){
            hospitals.add(Map.of("id", h.getId().toString(), "name", h.getName()));
        }

        return ResponseEntity.ok(hospitals);
    }
}
