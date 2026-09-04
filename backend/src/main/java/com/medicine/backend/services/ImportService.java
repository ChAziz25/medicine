package com.medicine.backend.services;

import com.medicine.backend.models.StudentVerification;
import com.medicine.backend.models.University;
import com.medicine.backend.repositories.StudentVerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
public class ImportService {

        private final StudentVerificationRepository studentVerificationRepository;

        public ImportService(
                StudentVerificationRepository studentVerificationRepository
        ) {
            this.studentVerificationRepository = studentVerificationRepository;
        }

        public int importCodes(MultipartFile file, University university) throws IOException {
            int added = 0;

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(file.getInputStream()))) {

                String line;

                // Skip header
                reader.readLine();

                while ((line = reader.readLine()) != null) {

                    String code = line.trim();

                    // Ignore empty lines
                    if (code.isEmpty()) {
                        continue;
                    }

                    // Skip if code already exists
                    if (studentVerificationRepository.existsById(code)) {
                        continue;
                    }

                    StudentVerification verification =
                            new StudentVerification(code, university);

                    studentVerificationRepository.save(verification);

                    added++;
                }
            }

            return added;
        }
}
