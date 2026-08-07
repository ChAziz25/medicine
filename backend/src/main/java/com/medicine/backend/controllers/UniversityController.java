package com.medicine.backend.controllers;

import com.medicine.backend.models.University;
import com.medicine.backend.repositories.UniversityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("api/university")
public class UniversityController {
    private final UniversityRepository universityRepository;

    public UniversityController(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    @PostMapping("/createUniversity")
    public ResponseEntity<?> createUniversity(@RequestBody Map<String, Object> body){
        try {
            String name = body.get("name").toString();

            University hospital = new University(name);
            universityRepository.save(hospital);

            return ResponseEntity.ok(Map.of(
                    "message", "University Created",
                    "University name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/listUniversities")
    public ResponseEntity<?> listUniversities(){
        List<Map<String, String>> universities = new ArrayList<>();

        for (University u: universityRepository.findAll()){
            universities.add(Map.of("id", u.getId().toString(), "name", u.getName()));
        }

        return ResponseEntity.ok(universities);
    }
}
