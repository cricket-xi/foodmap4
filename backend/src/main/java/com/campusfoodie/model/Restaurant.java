package com.campusfoodie.model;

import lombok.Data;
import java.util.List;

@Data
public class Restaurant {
    private Long id;
    private String name;
    private String emoji;
    private String university;
    private String category;
    private Double rating;
    private Integer price;
    private String distance;
    private Double latitude;
    private Double longitude;

    private List<String> tags;
    private List<String> dietaryFeatures;
    private List<Review> reviews;
    private List<MenuItem> menu;
}
