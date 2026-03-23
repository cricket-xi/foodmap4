package com.campusfoodie.controller;

import com.campusfoodie.model.Restaurant;
import com.campusfoodie.mapper.RestaurantMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantMapper restaurantMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @GetMapping
    public List<Restaurant> getAllRestaurants(
            @RequestParam(required = false) String university,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query) {
        
        String cacheKey = "restaurants:all";
        List<Restaurant> restaurants = (List<Restaurant>) redisTemplate.opsForValue().get(cacheKey);
        
        if (restaurants == null) {
            restaurants = restaurantMapper.findAll();
            redisTemplate.opsForValue().set(cacheKey, restaurants, 10, TimeUnit.MINUTES);
        }

        if (university != null && !university.equals("全部")) {
            restaurants = restaurants.stream()
                    .filter(r -> r.getUniversity().equals(university))
                    .collect(Collectors.toList());
        }

        if (category != null && !category.equals("全部")) {
            restaurants = restaurants.stream()
                    .filter(r -> r.getCategory().equals(category))
                    .collect(Collectors.toList());
        }

        if (query != null && !query.trim().isEmpty()) {
            String lowerQuery = query.toLowerCase();
            restaurants = restaurants.stream()
                    .filter(r -> r.getName().toLowerCase().contains(lowerQuery) ||
                            r.getTags().stream().anyMatch(t -> t.toLowerCase().contains(lowerQuery)))
                    .collect(Collectors.toList());
        }

        return restaurants;
    }

    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable Long id) {
        String cacheKey = "restaurant:" + id;
        Restaurant restaurant = (Restaurant) redisTemplate.opsForValue().get(cacheKey);
        
        if (restaurant == null) {
            restaurant = restaurantMapper.findById(id);
            if (restaurant != null) {
                redisTemplate.opsForValue().set(cacheKey, restaurant, 10, TimeUnit.MINUTES);
            }
        }
        return restaurant;
    }

    @Autowired
    private com.campusfoodie.mapper.MenuItemMapper menuItemMapper;

    @PutMapping("/{id}/menu")
    public java.util.Map<String, Object> updateRestaurantMenu(@PathVariable Long id, @RequestBody List<com.campusfoodie.model.MenuItem> menu) {
        menuItemMapper.deleteByRestaurantId(id);
        for (com.campusfoodie.model.MenuItem item : menu) {
            item.setRestaurantId(id);
            menuItemMapper.insert(item);
        }
        
        // Invalidate cache
        redisTemplate.delete("restaurant:" + id);
        redisTemplate.delete("restaurants:all");
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        return response;
    }
}
