package com.campusfoodie.controller;

import com.campusfoodie.model.User;
import com.campusfoodie.model.Review;
import com.campusfoodie.model.Restaurant;
import com.campusfoodie.mapper.UserMapper;
import com.campusfoodie.mapper.ReviewMapper;
import com.campusfoodie.mapper.RestaurantMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ReviewMapper reviewMapper;

    @Autowired
    private RestaurantMapper restaurantMapper;

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        User user = userMapper.findById(id);
        if (user != null) {
            List<Review> reviews = reviewMapper.findByUser(user.getUsername());
            user.setReviews(reviews);
        }
        return user;
    }

    @PostMapping("/{userId}/favorites/{restaurantId}")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long userId, @PathVariable Long restaurantId) {
        User user = userMapper.findById(userId);
        Restaurant restaurant = restaurantMapper.findById(restaurantId);

        if (user == null || restaurant == null) {
            return ResponseEntity.notFound().build();
        }

        List<Restaurant> favorites = user.getFavorites();
        boolean isFavorite = favorites.stream().anyMatch(r -> r.getId().equals(restaurantId));

        if (isFavorite) {
            userMapper.deleteFavorite(userId, restaurantId);
        } else {
            userMapper.insertFavorite(userId, restaurantId);
        }

        return ResponseEntity.ok().body("{\"isFavorite\": " + !isFavorite + "}");
    }
}
