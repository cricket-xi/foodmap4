package com.campusfoodie.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/merchant")
@CrossOrigin(origins = "*")
public class MerchantStatsController {

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("storeName", "张亮麻辣烫 (广大商业中心店)");
        stats.put("todayViews", 1245);
        stats.put("todayCoupons", 86);
        stats.put("todayRedeemed", 42);
        stats.put("trustScore", 92);

        stats.put("trafficData", Arrays.asList(
                createTrafficData("周一", 800, 200),
                createTrafficData("周二", 950, 250),
                createTrafficData("周三", 1100, 300),
                createTrafficData("周四", 1050, 280),
                createTrafficData("周五", 1400, 450),
                createTrafficData("周六", 1800, 600),
                createTrafficData("周日", 1600, 550)
        ));

        stats.put("schoolData", Arrays.asList(
                createSchoolData("广州大学", 65),
                createSchoolData("华南师范大学", 20),
                createSchoolData("广东工业大学", 10),
                createSchoolData("其他", 5)
        ));

        return ResponseEntity.ok(stats);
    }

    private Map<String, Object> createTrafficData(String date, int views, int clicks) {
        Map<String, Object> data = new HashMap<>();
        data.put("date", date);
        data.put("views", views);
        data.put("clicks", clicks);
        return data;
    }

    private Map<String, Object> createSchoolData(String name, int value) {
        Map<String, Object> data = new HashMap<>();
        data.put("name", name);
        data.put("value", value);
        return data;
    }
}
