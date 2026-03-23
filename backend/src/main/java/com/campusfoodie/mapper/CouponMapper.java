package com.campusfoodie.mapper;

import com.campusfoodie.model.Coupon;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CouponMapper {
    List<Coupon> findAll();
    List<Coupon> findByRestaurantId(@Param("restaurantId") Long restaurantId);
    Coupon findById(@Param("id") Long id);
    int insert(Coupon coupon);
    int update(Coupon coupon);
    int delete(@Param("id") Long id);
}
