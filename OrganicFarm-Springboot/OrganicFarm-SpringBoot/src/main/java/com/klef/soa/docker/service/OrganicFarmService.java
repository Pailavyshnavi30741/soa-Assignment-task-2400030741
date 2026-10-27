package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.OrganicFarmRequest;
import com.klef.soa.docker.dto.OrganicFarmResponse;

public interface OrganicFarmService
{
    OrganicFarmResponse addFarm(OrganicFarmRequest farm);

    String updateFarm(Long id, OrganicFarmRequest farm);

    OrganicFarmResponse displayById(Long id);

    List<OrganicFarmResponse> displayAll();

    String delete(Long id);
}