package com.campusfoodie.controller;

import com.campusfoodie.model.Restaurant;
import com.campusfoodie.model.Review;
import com.campusfoodie.mapper.RestaurantMapper;
import com.campusfoodie.mapper.ReviewMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private RestaurantMapper restaurantMapper;

    @Autowired
    private ReviewMapper reviewMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @PostMapping
    public ResponseEntity<?> addReview(@PathVariable Long restaurantId, @RequestBody Review review) {
        Restaurant restaurant = restaurantMapper.findById(restaurantId);
        if (restaurant != null) {
            review.setRestaurantId(restaurantId);
            
            // Set current date if not provided
            if (review.getDate() == null || review.getDate().isEmpty()) {
                review.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            }
            
            // Set default avatar if not provided
            if (review.getAvatar() == null || review.getAvatar().isEmpty()) {
                review.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + review.getUser());
            }

            reviewMapper.insert(review);
            
            // Update restaurant rating
            List<Review> reviews = reviewMapper.findByRestaurantId(restaurantId);
            double newRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
            restaurant.setRating(Math.round(newRating * 10.0) / 10.0);
            restaurantMapper.update(restaurant);
            
            // Invalidate cache
            redisTemplate.delete("restaurant:" + restaurantId);
            redisTemplate.delete("restaurants:all");
            
            return ResponseEntity.ok(review);
        }
        return ResponseEntity.notFound().build();
    }
}
