package com.klef.soa.docker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrganicFarmResponse
{
    private Long id;
    private String farmName;
    private String cropType;
    private Double areaAcres;
    private Boolean certified;
}