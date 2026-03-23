package com.campusfoodie.mapper;

import com.campusfoodie.model.Review;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ReviewMapper {
    List<Review> findByUser(@Param("user") String user);
    List<Review> findByRestaurantId(@Param("restaurantId") Long restaurantId);
    void insert(Review review);
    void update(Review review);
    void deleteById(@Param("id") Long id);
}
