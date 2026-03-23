package com.campusfoodie.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/merchant")
@CrossOrigin(origins = "*")
public class MerchantActionController {

    @PostMapping("/publish-coupon")
    public ResponseEntity<?> publishCoupon(@RequestBody Map<String, Object> payload) {
        // Mock publishing a coupon
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "发布成功！已推送到周边学生端。");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-coupon")
    public ResponseEntity<?> verifyCoupon(@RequestBody Map<String, Object> payload) {
        // Mock verifying a coupon
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "核销成功！");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reviews/{reviewId}/reply")
    public ResponseEntity<?> replyReview(@PathVariable Long reviewId, @RequestBody Map<String, Object> payload) {
        // Mock replying to a review
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "回复成功！");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reviews/{reviewId}/appeal")
    public ResponseEntity<?> appealReview(@PathVariable Long reviewId, @RequestBody Map<String, Object> payload) {
        // Mock appealing a review
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "申诉已提交，平台将尽快处理。");
        return ResponseEntity.ok(response);
    }
}
