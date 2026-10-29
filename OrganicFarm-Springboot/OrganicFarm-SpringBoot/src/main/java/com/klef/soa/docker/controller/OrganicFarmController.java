package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.OrganicFarmRequest;
import com.klef.soa.docker.dto.OrganicFarmResponse;
import com.klef.soa.docker.service.OrganicFarmService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/organicfarm")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:3000"
})
public class OrganicFarmController {

    @Autowired
    private OrganicFarmService organicFarmService;

    @GetMapping("/")
    public String home() {
        return "Organic Farm Service is running...";
    }

    @PostMapping("/add")
    public OrganicFarmResponse addFarm(@Valid @RequestBody OrganicFarmRequest farm) {
        return organicFarmService.addFarm(farm);
    }

    @GetMapping("/displayAll")
    public List<OrganicFarmResponse> displayAll() {
        return organicFarmService.displayAll();
    }

    @GetMapping("/displayById/{id}")
    public OrganicFarmResponse displayById(@PathVariable Long id) {
        return organicFarmService.displayById(id);
    }

    @PutMapping("/update/{id}")
    public String updateFarm(
            @PathVariable Long id,
            @Valid @RequestBody OrganicFarmRequest farm) {
        return organicFarmService.updateFarm(id, farm);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteFarm(@PathVariable Long id) {
        return organicFarmService.delete(id);
    }
}
