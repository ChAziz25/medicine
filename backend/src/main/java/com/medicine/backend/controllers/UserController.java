package com.medicine.backend.controllers;

import com.medicine.backend.models.*;
import com.medicine.backend.models.users.*;
import com.medicine.backend.repositories.*;
import com.medicine.backend.services.JwtService;
import com.medicine.backend.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final H_AdminRepository h_adminRepository;
    private final Uni_AdminRepository uni_adminRepository;
    private final HospitalRepository hospitalRepository;
    private final UniversityRepository universityRepository;
    private final H_EmployeeRepository h_employeeRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final StudentVerificationRepository studentVerificationRepository;
    private final HospitalServiceRepository hospitalServiceRepository;
    private final ApplicationRepository applicationRepository;
    private final JwtService jwtService;
    private final UserService userService;

    public UserController(UserRepository userRepository, AdminRepository adminRepository, H_AdminRepository hAdminRepository, Uni_AdminRepository uniAdminRepository, HospitalRepository hospitalRepository, UniversityRepository universityRepository, H_EmployeeRepository hEmployeeRepository, TeacherRepository teacherRepository, StudentRepository studentRepository, StudentVerificationRepository studentVerificationRepository, HospitalServiceRepository hospitalServiceRepository, ApplicationRepository applicationRepository, JwtService jwtService, UserService userService) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        h_adminRepository = hAdminRepository;
        uni_adminRepository = uniAdminRepository;
        this.hospitalRepository = hospitalRepository;
        this.universityRepository = universityRepository;
        h_employeeRepository = hEmployeeRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.studentVerificationRepository = studentVerificationRepository;
        this.hospitalServiceRepository = hospitalServiceRepository;
        this.applicationRepository = applicationRepository;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/AdminRegister")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, Object> body) {
        try {
            String name = body.get("name").toString();
            String email = body.get("email").toString();
            String password = body.get("password").toString();

            Admin Admin = new Admin(name, email, password);
            adminRepository.save(Admin);

            return ResponseEntity.ok(Map.of(
                    "message", "User Created",
                    "User name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        try {
            String email = body.get("email").toString();
            String password = body.get("password").toString();

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }

            User user = userOpt.get();
            if (!user.getPassword().equals(password)) {
                return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
            }

            String role = switch (user) {
                case Admin      a   -> "ADMIN";
                case Student    s   -> "STUDENT";
                case Teacher    t   -> "TEACHER";
                case H_Employee h   -> "HOSPITAL_EMPLOYEE";
                case H_Admin    ha  -> "HOSPITAL_ADMIN";
                case Uni_Admin  ua  -> "UNIVERSITY_ADMIN";
                default             -> "UNKNOWN";
            };

            String token = jwtService.generateToken(user, role);

                ResponseCookie cookie = ResponseCookie
                        .from("token", token)
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(Duration.ofHours(1))
                        .sameSite("Lax")
                        .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(Map.of(
                    "message", "Login successful",
                    "name", user.getName(),
                    "role", role
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        ResponseCookie cookie = ResponseCookie
                .from("token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Logged out"));
    }

    @GetMapping("/checkSession")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of(
                "id", userId,
                "name", request.getAttribute("userName"),
                "role", request.getAttribute("userRole")
        ));
    }

    @PostMapping("/H_AdminRegister")
    public ResponseEntity<?> registerH_Admin(@RequestBody Map<String, Object> body) {
        try {
            String name = body.get("name").toString();
            String email = body.get("email").toString();
            String password = body.get("password").toString();
            UUID hospitalId = UUID.fromString(body.get("hospitalId").toString());

            Hospital hospital = hospitalRepository.findById(hospitalId)
                    .orElseThrow(() -> new RuntimeException("Hospital not found"));

            H_Admin Admin = new H_Admin(name, email, password, hospital);
            h_adminRepository.save(Admin);

            return ResponseEntity.ok(Map.of(
                    "message", "User Created",
                    "User name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/Uni_AdminRegister")
    public ResponseEntity<?> registerUni_Admin(@RequestBody Map<String, Object> body) {
        try {
            String name = body.get("name").toString();
            String email = body.get("email").toString();
            String password = body.get("password").toString();
            UUID universityId = UUID.fromString(body.get("universityId").toString());

            University university = universityRepository.findById(universityId)
                    .orElseThrow(() -> new RuntimeException("university not found"));

            Uni_Admin Admin = new Uni_Admin(name, email, password, university);
            uni_adminRepository.save(Admin);

            return ResponseEntity.ok(Map.of(
                    "message", "User Created",
                    "User name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/H_EmployeeRegister")
    public ResponseEntity<?> registerH_Employee(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        try {
            String name = body.get("name").toString();
            String email = body.get("email").toString();
            String password = body.get("password").toString();

            UUID userId = UUID.fromString(request.getAttribute("userId").toString());

            H_Admin admin = h_adminRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Hospital admin not found"));

            Hospital hospital = admin.getHospital();

            H_Employee h_employee = new H_Employee(name, email, password, hospital);
            h_employeeRepository.save(h_employee);

            return ResponseEntity.ok(Map.of(
                    "message", "H_Employee Created",
                    "H_Employee name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/TeacherRegister")
    public ResponseEntity<?> registerTeacher(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        try {
            String name = body.get("name").toString();
            String email = body.get("email").toString();
            String password = body.get("password").toString();

            UUID userId = UUID.fromString(request.getAttribute("userId").toString());

            Uni_Admin admin = uni_adminRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("University admin not found"));

            University university = admin.getUniversity();

            Teacher teacher = new Teacher(name, email, password, university);
            teacherRepository.save(teacher);;

            return ResponseEntity.ok(Map.of(
                    "message", "Teacher Created",
                    "Teacher name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/StudentRegister")
    public ResponseEntity<?> registerStudent(@RequestBody Map<String, Object> body) {
        try {
            String name = body.get("name").toString();
            String email = body.get("email").toString();
            String password = body.get("password").toString();
            String verificationCode = body.get("verificationCode").toString();

            StudentVerification verification = studentVerificationRepository.findById(verificationCode)
                    .orElseThrow(() -> new RuntimeException("verification code maybe wrong"));

            Student student = new Student(name, email, password, verification.getUniversity());
            studentRepository.save(student);

            return ResponseEntity.ok(Map.of(
                    "message", "Student Created",
                    "Student name : ", name
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/addStudentCode")
    public ResponseEntity<?> addStudentCode(@RequestBody Map<String, Object> body, HttpServletRequest request){
        try {
            String verificationCode = body.get("verificationCode").toString();

            University university = userService.getUserUniversity(request);

            StudentVerification studentVerification = new StudentVerification(verificationCode, university);
            studentVerificationRepository.save(studentVerification);

            return ResponseEntity.ok(Map.of(
                    "message", "Student Code Added",
                    "Student code : ", verificationCode
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/Apply")
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        try {
            UUID studentId = UUID.fromString(request.getAttribute("userId").toString());
            UUID hospitalServiceId = UUID.fromString(body.get("hospitalServiceId").toString());

            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("student not found"));

            HospitalService hospitalService = hospitalServiceRepository.findById(hospitalServiceId)
                    .orElseThrow(() -> new RuntimeException("student not found"));

            if ( hospitalService.getCapacity() <= 0 ) {
                return ResponseEntity.status(409).body(Map.of("error", "Sorry, No internship positions available"));
            }

            hospitalService.setCapacity(hospitalService.getCapacity() - 1 );
            hospitalServiceRepository.save(hospitalService);

            Application application = new Application(student, hospitalService);
            applicationRepository.save(application);

            return ResponseEntity.ok(Map.of(
                    "message", "Application confirmed",
                    "student name : ", student.getName(),
                    "hospital name : ", hospitalService.getHospital().getName(),
                    "service : ", hospitalService.getService().getName()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("listApplicationsByStudentId")
    public ResponseEntity<?> listApplicationsByStudentId(HttpServletRequest request) {
        UUID userId = UUID.fromString(request.getAttribute("userId").toString());

        List<Application> applications = new ArrayList<>(applicationRepository.findAllByStudentId(userId));

        return ResponseEntity.ok(applications);
    }

    @GetMapping("listApplicationsByHospitalId")
    public ResponseEntity<?> listApplicationsByHospitalId(HttpServletRequest request) {
        UUID userId = UUID.fromString(request.getAttribute("userId").toString());
        H_Admin h_admin = h_adminRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Hospital admin not found"));

        List<Application> applications = new ArrayList<>(
                applicationRepository.findAllByHospitalServiceHospitalId(h_admin.getHospital().getId()));

        return ResponseEntity.ok(applications);
    }

    @PatchMapping("applicationReview")
    public ResponseEntity<?> applicationReview(@RequestBody Map<String, Object> body){
        try {
            UUID applicationId = UUID.fromString(body.get("applicationId").toString());
            Boolean accepted = (Boolean) body.get("accepted");

            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            if (accepted){
                application.setStatus(Status.ACCEPTED);
                applicationRepository.save(application);
                return ResponseEntity.ok(Map.of(
                        "message", "Application accepted",
                        "student : ", application.getStudent().getName(),
                        "hospital : ", application.getHospitalService().getHospital().getName(),
                        "service : ", application.getHospitalService().getService().getName()
                ));
            } else {
                application.setStatus(Status.REFUSED);
                applicationRepository.save(application);

                HospitalService hospitalService = application.getHospitalService();
                hospitalService.setCapacity(hospitalService.getCapacity() + 1);
                hospitalServiceRepository.save(hospitalService);

                return ResponseEntity.ok(Map.of(
                        "message", "Application refused",
                        "student : ", application.getStudent().getName(),
                        "hospital : ", application.getHospitalService().getHospital().getName(),
                        "service : ", application.getHospitalService().getService().getName()
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
