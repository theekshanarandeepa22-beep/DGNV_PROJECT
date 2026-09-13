package com.dgnv.auth_service.service;

import com.dgnv.auth_service.dto.LoginRequest;
import com.dgnv.auth_service.dto.LoginResponse;
import com.dgnv.auth_service.dto.RegisterRequest;
import com.dgnv.auth_service.entity.User;
import com.dgnv.auth_service.enums.Role;
import com.dgnv.auth_service.jwt.JwtService;
import com.dgnv.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import com.dgnv.auth_service.dto.ChangePasswordRequest;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${user.service.url:http://localhost:6002}")
    private String userServiceUrl;

    @Value("${officer.service.url:http://localhost:6002}")
    private String officerServiceUrl;

    @Transactional
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email Already Exists";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CITIZEN);
        user.setActive(true);

        User savedUser = userRepository.saveAndFlush(user);

        createCitizenProfile(savedUser, request);

        return "Citizen Registered Successfully";
    }

    @Transactional
    public String registerOfficer(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email Already Exists";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.OFFICER);
        user.setActive(true);

        User savedUser = userRepository.saveAndFlush(user);

        createOfficerProfile(savedUser, request);

        return "Officer Registered Successfully";
    }

    private void createCitizenProfile(User user, RegisterRequest request) {
        Map<String, Object> profile = baseProfile(user, request);

        try {
            restTemplate.postForEntity(
                    userServiceUrl + "/citizens",
                    profile,
                    String.class
            );
        } catch (RestClientException ex) {
            throw new IllegalStateException("Citizen profile creation failed", ex);
        }
    }

    private void createOfficerProfile(User user, RegisterRequest request) {
        Map<String, Object> profile = baseProfile(user, request);
        profile.put("nicNumber", request.getNicNumber());

        try {
            restTemplate.postForEntity(
                    officerServiceUrl + "/officers",
                    profile,
                    String.class
            );
        } catch (RestClientException ex) {
            throw new IllegalStateException("Officer profile creation failed", ex);
        }
    }

    private Map<String, Object> baseProfile(User user, RegisterRequest request) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("userId", user.getId());
        profile.put("fullName", user.getFullName());
        profile.put("email", user.getEmail());
        profile.put("district", request.getDistrict());
        profile.put("dsDivision", request.getDsDivision());
        profile.put("gsDivision", request.getGsDivision());
        profile.put("active", true);
        return profile;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new LoginResponse(null, "User Not Found");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return new LoginResponse(null, "Invalid Password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                user.getRole().name()
        );
    }
    public String changePassword(ChangePasswordRequest request) {

    User user = userRepository
            .findByEmail(request.getEmail())
            .orElse(null);

    if (user == null) {
        return "User Not Found";
    }

    if (!passwordEncoder.matches(
            request.getOldPassword(),
            user.getPassword())) {

        return "Old Password Incorrect";
    }

    user.setPassword(
            passwordEncoder.encode(
                    request.getNewPassword()
            )
    );

    userRepository.save(user);

    return "Password Changed Successfully";
}
public String registerAdmin(RegisterRequest request) {

    if (userRepository.existsByEmail(request.getEmail())) {
        return "Email Already Exists";
    }

    User user = new User();

    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.ADMIN);
    user.setActive(true);

    userRepository.save(user);

    return "Admin Registered Successfully";
}
}
