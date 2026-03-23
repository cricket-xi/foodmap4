package com.campusfoodie.controller;

import com.campusfoodie.model.User;
import com.campusfoodie.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        String role = credentials.get("role");

        User user = userMapper.findByUsername(username);

        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            if (user.getPassword().equals(password) && user.getRole().equals(role)) {
                response.put("success", true);
                response.put("user", user);
                return ResponseEntity.ok(response);
            }
        }

        response.put("success", false);
        response.put("message", "账号或密码错误");
        return ResponseEntity.ok(response);
    }
}
