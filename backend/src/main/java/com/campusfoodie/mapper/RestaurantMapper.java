package com.campusfoodie.mapper;

import com.campusfoodie.model.Restaurant;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface RestaurantMapper {
    List<Restaurant> findAll();
    Restaurant findById(@Param("id") Long id);
    void insert(Restaurant restaurant);
    void update(Restaurant restaurant);
    void deleteById(@Param("id") Long id);
    
    List<String> findTagsByRestaurantId(@Param("restaurantId") Long restaurantId);
    List<String> findDietaryFeaturesByRestaurantId(@Param("restaurantId") Long restaurantId);
    
    void insertTags(@Param("restaurantId") Long restaurantId, @Param("tags") List<String> tags);
    void insertDietaryFeatures(@Param("restaurantId") Long restaurantId, @Param("features") List<String> features);
    void deleteTagsByRestaurantId(@Param("restaurantId") Long restaurantId);
    void deleteDietaryFeaturesByRestaurantId(@Param("restaurantId") Long restaurantId);
}
