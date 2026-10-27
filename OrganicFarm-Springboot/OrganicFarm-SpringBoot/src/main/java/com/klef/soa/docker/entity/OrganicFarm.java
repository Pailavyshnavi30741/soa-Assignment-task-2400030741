package com.klef.soa.docker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "OrganicFarms")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganicFarm
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmName;

    @Column(nullable = false)
    private String cropType;

    @Column(nullable = false)
    private Double areaAcres;

    @Column(nullable = false)
    private Boolean certified;
}