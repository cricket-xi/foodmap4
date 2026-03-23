package com.campusfoodie.mapper;

import com.campusfoodie.model.MenuItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface MenuItemMapper {
    List<MenuItem> findByRestaurantId(@Param("restaurantId") Long restaurantId);
    void insert(MenuItem menuItem);
    void update(MenuItem menuItem);
    void deleteById(@Param("id") Long id);
    void deleteByRestaurantId(@Param("restaurantId") Long restaurantId);
}
