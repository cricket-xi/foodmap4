package com.campusfoodie.model;

import lombok.Data;

@Data
public class MenuItem {
    private Long id;
    private Long restaurantId;
    private String name;
    private Double price;
    private String description;
    private String image;
    private String status;
}
