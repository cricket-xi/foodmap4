package com.campusfoodie.controller;

import com.campusfoodie.mapper.CouponMapper;
import com.campusfoodie.mapper.PlatformLogMapper;
import com.campusfoodie.model.Coupon;
import com.campusfoodie.model.PlatformLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    @Autowired
    private CouponMapper couponMapper;

    @Autowired
    private PlatformLogMapper platformLogMapper;

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponMapper.findAll();
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Coupon> getCouponsByRestaurant(@PathVariable Long restaurantId) {
        return couponMapper.findByRestaurantId(restaurantId);
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        couponMapper.insert(coupon);
        
        // Log the action
        PlatformLog log = new PlatformLog();
        log.setActionType("CREATE_COUPON");
        log.setActorId(coupon.getRestaurantId()); // Assuming merchant creates it
        log.setActorRole("merchant");
        log.setTargetId(coupon.getId());
        log.setDescription("Merchant created a new coupon: " + coupon.getTitle());
        platformLogMapper.insert(log);

        return ResponseEntity.ok(coupon);
    }
}
