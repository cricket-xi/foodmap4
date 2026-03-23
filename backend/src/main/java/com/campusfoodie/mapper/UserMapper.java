package com.campusfoodie.mapper;

import com.campusfoodie.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.Optional;

@Mapper
public interface UserMapper {
    User findByUsername(@Param("username") String username);
    User findById(@Param("id") Long id);
    void insert(User user);
    void update(User user);
    void deleteById(@Param("id") Long id);
    
    void insertFavorite(@Param("userId") Long userId, @Param("restaurantId") Long restaurantId);
    void deleteFavorite(@Param("userId") Long userId, @Param("restaurantId") Long restaurantId);
}
