package com.medicine.backend.services;

import com.medicine.backend.models.Hospital;
import com.medicine.backend.models.University;
import com.medicine.backend.models.users.Uni_Admin;
import com.medicine.backend.repositories.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    private final H_AdminRepository h_adminRepository;
    private final H_EmployeeRepository h_employeeRepository;
    private final Uni_AdminRepository uni_adminRepository;
    private final TeacherRepository teacherRepository;

    public UserService(H_AdminRepository hAdminRepository, H_EmployeeRepository hEmployeeRepository, Uni_AdminRepository uniAdminRepository, TeacherRepository teacherRepository) {
        h_adminRepository = hAdminRepository;
        h_employeeRepository = hEmployeeRepository;
        uni_adminRepository = uniAdminRepository;
        this.teacherRepository = teacherRepository;
    }

    public boolean hasRole(HttpServletRequest request, String... allowedRoles) {
        String role = request.getAttribute("role").toString();

        for (String allowedRole : allowedRoles) {
            if (role.equals(allowedRole)) {
                return true;
            }
        }

        return false;
    }

    public boolean hasAccess(HttpServletRequest request, UUID institutionId) {
        UUID userId = UUID.fromString(request.getAttribute("userId").toString());
        String role = request.getAttribute("role").toString();

        UUID userInstitutionId = switch (role) {
            case "H_Admin" ->
                    h_adminRepository.findById(userId)
                            .map(user -> user.getHospital().getId())
                            .orElse(null);

            case "H_Employee" ->
                h_employeeRepository.findById(userId)
                        .map(user -> user.getHospital().getId())
                        .orElse(null);

            case "Uni_Admin" ->
                uni_adminRepository.findById(userId)
                        .map(user -> user.getUniversity().getId())
                        .orElse(null);
            case "Teacher" ->
                    teacherRepository.findById(userId)
                            .map(user -> user.getUniversity().getId())
                            .orElse(null);

            default -> null;
        };

        return userInstitutionId != null && userInstitutionId.equals(institutionId);
    }

    public University getUserUniversity(HttpServletRequest request) {
        UUID userId = UUID.fromString(request.getAttribute("userId").toString());
        String role = request.getAttribute("role").toString();

        return switch (role) {
            case "Uni_Admin" ->
                    uni_adminRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("University admin not found"))
                            .getUniversity();

            case "Teacher" ->
                    teacherRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Teacher not found"))
                            .getUniversity();

            default ->
                    throw new RuntimeException("User is not a university user");
        };
    }

    public Hospital getUserHospital(HttpServletRequest request) {
        UUID userId = UUID.fromString(request.getAttribute("userId").toString());
        String role = request.getAttribute("role").toString();

        return switch (role) {
            case "H_Admin" ->
                    h_adminRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Hospital admin not found"))
                            .getHospital();

            case "H_Employee" ->
                    h_employeeRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Employee not found"))
                            .getHospital();

            default ->
                    throw new RuntimeException("User is not a hospital user");
        };
    }
}
