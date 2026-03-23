package com.campusfoodie.model;

import lombok.Data;

@Data
public class Review {
    private Long id;
    private Long restaurantId;
    private String user;
    private String avatar;
    private Integer rating;
    private String content;
    private String date;
}
