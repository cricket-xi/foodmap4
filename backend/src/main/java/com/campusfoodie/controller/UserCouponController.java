package com.campusfoodie.controller;

import com.campusfoodie.mapper.CouponMapper;
import com.campusfoodie.mapper.PlatformLogMapper;
import com.campusfoodie.mapper.UserCouponMapper;
import com.campusfoodie.model.Coupon;
import com.campusfoodie.model.PlatformLog;
import com.campusfoodie.model.UserCoupon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-coupons")
@CrossOrigin(origins = "*")
public class UserCouponController {

    @Autowired
    private UserCouponMapper userCouponMapper;

    @Autowired
    private CouponMapper couponMapper;

    @Autowired
    private PlatformLogMapper platformLogMapper;

    @GetMapping("/user/{userId}")
    public List<UserCoupon> getUserCoupons(@PathVariable Long userId) {
        return userCouponMapper.findByUserId(userId);
    }

    @PostMapping("/claim")
    public ResponseEntity<?> claimCoupon(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long couponId = payload.get("couponId");

        if (userId == null || couponId == null) {
            return ResponseEntity.badRequest().body("userId and couponId are required");
        }

        Coupon coupon = couponMapper.findById(couponId);
        if (coupon == null) {
            return ResponseEntity.badRequest().body("Coupon not found");
        }

        if (coupon.getRemainingQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Coupon is out of stock");
        }

        // Check if valid
        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) {
            return ResponseEntity.badRequest().body("Coupon has expired");
        }

        // Decrease quantity
        coupon.setRemainingQuantity(coupon.getRemainingQuantity() - 1);
        couponMapper.update(coupon);

        // Create user coupon
        UserCoupon userCoupon = new UserCoupon();
        userCoupon.setUserId(userId);
        userCoupon.setCouponId(couponId);
        userCoupon.setStatus("UNUSED");
        userCouponMapper.insert(userCoupon);

        // Log action
        PlatformLog log = new PlatformLog();
        log.setActionType("CLAIM_COUPON");
        log.setActorId(userId);
        log.setActorRole("user");
        log.setTargetId(couponId);
        log.setDescription("User claimed coupon: " + coupon.getTitle());
        platformLogMapper.insert(log);

        return ResponseEntity.ok(userCoupon);
    }
}
