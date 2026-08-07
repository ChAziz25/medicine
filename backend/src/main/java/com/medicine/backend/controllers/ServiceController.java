package com.medicine.backend.controllers;

import com.medicine.backend.models.Hospital;
import com.medicine.backend.models.HospitalService;
import com.medicine.backend.models.Service;
import com.medicine.backend.models.Type;
import com.medicine.backend.repositories.HospitalRepository;
import com.medicine.backend.repositories.HospitalServiceRepository;
import com.medicine.backend.repositories.ServiceRepository;
import com.medicine.backend.repositories.TypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/service")
public class ServiceController {
    private final TypeRepository typeRepository;
    private final ServiceRepository serviceRepository;
    private final HospitalRepository hospitalRepository;
    private final HospitalServiceRepository hospitalServiceRepository;

    public ServiceController(TypeRepository typeRepository, ServiceRepository serviceRepository, HospitalRepository hospitalRepository, HospitalServiceRepository hospitalServiceRepository) {
        this.typeRepository = typeRepository;
        this.serviceRepository = serviceRepository;
        this.hospitalRepository = hospitalRepository;
        this.hospitalServiceRepository = hospitalServiceRepository;
    }

    @PostMapping("add_type")
    public ResponseEntity<?> add_type(@RequestBody Map<String, Object> body) {
        try {
            String name = body.get("name").toString();

            Type type = new Type(name);
            typeRepository.save(type);

            return ResponseEntity.ok(Map.of(
                    "message", "type Created",
                    "type name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("list_type")
    public ResponseEntity<?> list_type() {
        List<Map<String, String>> types = new ArrayList<>();

        for (Type t: typeRepository.findAll()){
            types.add(Map.of("id", t.getId().toString(), "name", t.getName()));
        }

        return ResponseEntity.ok(types);
    }

    @PostMapping("add_service")
    public ResponseEntity<?> add_service(@RequestBody Map<String, Object> body) {
        try {
            String name = body.get("name").toString();
            UUID typeId = UUID.fromString(body.get("typeId").toString());

            Type type = typeRepository.findById(typeId)
                    .orElseThrow(() -> new RuntimeException("type not found"));

            Service service = new Service(name, type);
            serviceRepository.save(service);

            return ResponseEntity.ok(Map.of(
                    "message", "type Created",
                    "type name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("list_service")
    public ResponseEntity<?> list_service() {
        List<Map<String, String>> services = new ArrayList<>();

        for (Service s: serviceRepository.findAll()){
            services.add(Map.of("id", s.getId().toString(), "name", s.getName()));
        }

        return ResponseEntity.ok(services);
    }

    @PostMapping("add_ServiceToHospital")
    public ResponseEntity<?> add_ServiceToHospital(@RequestBody Map<String, Object> body) {
        try {
            UUID hospitalId = UUID.fromString(body.get("hospitalId").toString());
            UUID serviceId = UUID.fromString(body.get("serviceId").toString());

            Hospital hospital = hospitalRepository.findById(hospitalId)
                    .orElseThrow(() -> new RuntimeException("hospital not found"));

            Service service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("service not found"));

            HospitalService hospitalService = new HospitalService(hospital, service);
            hospitalServiceRepository.save(hospitalService);

            return ResponseEntity.ok(Map.of(
                    "message", "service added",
                    "hospital", hospital.getName(),
                    "service", service.getName()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("list_HospitalService")
    public ResponseEntity<?> list_HospitalService(){
        List<Map<String, ?>> hospitalService = new ArrayList<>();

        for (HospitalService hs: hospitalServiceRepository.findAll()){
            hospitalService.add(Map.of("id", hs.getId().toString(),
                    "hospital name", hs.getHospital().getName(),
                    "service name", hs.getService().getName(),
                    "capacity", hs.getCapacity()));
        }

        return ResponseEntity.ok(hospitalService);
    }
}
