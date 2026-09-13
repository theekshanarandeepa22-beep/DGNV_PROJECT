package com.dgnv.auth_service.dto;

public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;

    private String nicNumber;
    private String district;
    private String dsDivision;
    private String gsDivision;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNicNumber() {
        return nicNumber;
    }

    public void setNicNumber(String nicNumber) {
        this.nicNumber = nicNumber;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getDsDivision() {
        return dsDivision;
    }

    public void setDsDivision(String dsDivision) {
        this.dsDivision = dsDivision;
    }

    public String getGsDivision() {
        return gsDivision;
    }

    public void setGsDivision(String gsDivision) {
        this.gsDivision = gsDivision;
    }
}