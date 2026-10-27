package com.klef.soa.docker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.OrganicFarmRequest;
import com.klef.soa.docker.dto.OrganicFarmResponse;
import com.klef.soa.docker.entity.OrganicFarm;
import com.klef.soa.docker.repository.OrganicFarmRepository;
import com.klef.soa.docker.service.OrganicFarmService;

@Service
public class OrganicFarmServiceImpl implements OrganicFarmService
{
    @Autowired
    private OrganicFarmRepository repo;

    @Override
    public OrganicFarmResponse addFarm(OrganicFarmRequest request)
    {
        OrganicFarm farm = OrganicFarm.builder()
                .farmName(request.getFarmName())
                .cropType(request.getCropType())
                .areaAcres(request.getAreaAcres())
                .certified(request.getCertified())
                .build();

        OrganicFarm savedFarm = repo.save(farm);

        return mapToResponse(savedFarm);
    }

    @Override
    public List<OrganicFarmResponse> displayAll()
    {
        return repo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public String delete(Long id)
    {
        if (repo.existsById(id))
        {
            repo.deleteById(id);
            return "Organic farm deleted successfully";
        }
        else
        {
            return "Organic farm not found";
        }
    }

    @Override
    public String updateFarm(Long id, OrganicFarmRequest request)
    {
        if (repo.existsById(id))
        {
            OrganicFarm farm = OrganicFarm.builder()
                    .id(id)
                    .farmName(request.getFarmName())
                    .cropType(request.getCropType())
                    .areaAcres(request.getAreaAcres())
                    .certified(request.getCertified())
                    .build();

            repo.save(farm);

            return "Organic farm updated successfully";
        }

        return "Organic farm with ID " + id + " not found";
    }

    @Override
    public OrganicFarmResponse displayById(Long id)
    {
        OrganicFarm farm = repo.findById(id).orElse(null);

        if (farm == null)
            return null;

        return mapToResponse(farm);
    }

    private OrganicFarmResponse mapToResponse(OrganicFarm farm)
    {
        return OrganicFarmResponse.builder()
                .id(farm.getId())
                .farmName(farm.getFarmName())
                .cropType(farm.getCropType())
                .areaAcres(farm.getAreaAcres())
                .certified(farm.getCertified())
                .build();
    }
}