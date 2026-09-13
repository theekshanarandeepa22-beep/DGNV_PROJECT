package com.dgnv.auth_service.controller;

import com.dgnv.auth_service.dto.LoginRequest;
import com.dgnv.auth_service.dto.LoginResponse;
import com.dgnv.auth_service.dto.RegisterRequest;
import com.dgnv.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.dgnv.auth_service.dto.ChangePasswordRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/register-officer")
    public String registerOfficer(@RequestBody RegisterRequest request) {
        return authService.registerOfficer(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
    @GetMapping("/test")
public String test() {
    return "JWT Working";
}
@PostMapping("/admin/register-officer")
public String registerOfficerByAdmin(
        @RequestBody RegisterRequest request) {

    return authService.registerOfficer(request);
}
@PutMapping("/change-password")
public String changePassword(
        @RequestBody ChangePasswordRequest request) {

    return authService.changePassword(request);
}
@PostMapping("/register-admin")
public String registerAdmin(
        @RequestBody RegisterRequest request) {

    return authService.registerAdmin(request);
}
}
