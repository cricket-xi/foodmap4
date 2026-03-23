package com.campusfoodie.controller;

import com.campusfoodie.mapper.PlatformLogMapper;
import com.campusfoodie.model.PlatformLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class PlatformLogController {

    @Autowired
    private PlatformLogMapper platformLogMapper;

    @GetMapping
    public List<PlatformLog> getAllLogs() {
        return platformLogMapper.findAll();
    }

    @GetMapping("/role/{actorRole}")
    public List<PlatformLog> getLogsByRole(@PathVariable String actorRole) {
        return platformLogMapper.findByActorRole(actorRole);
    }
}
