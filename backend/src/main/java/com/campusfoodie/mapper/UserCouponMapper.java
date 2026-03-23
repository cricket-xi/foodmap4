package com.campusfoodie.mapper;

import com.campusfoodie.model.UserCoupon;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserCouponMapper {
    List<UserCoupon> findByUserId(@Param("userId") Long userId);
    int insert(UserCoupon userCoupon);
    int update(UserCoupon userCoupon);
}
