package com.klef.soa.docker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class OrganicFarmRequest {

    @NotBlank(message = "Farm name is required")
    private String farmName;

    @NotBlank(message = "Crop type is required")
    private String cropType;

    @NotNull(message = "Area in acres is required")
    @Positive(message = "Area must be greater than zero")
    private Double areaAcres;

    @NotNull(message = "Certified status is required")
    private Boolean certified;
}