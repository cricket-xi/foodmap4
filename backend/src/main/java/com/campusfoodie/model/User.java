package com.campusfoodie.model;

import lombok.Data;
import java.util.List;

@Data
public class User {
    private Long id;
    private String username;
    private String password;
    private String role;
    private String avatar;
    private String university;
    private Integer level;
    private Integer exp;
    private Integer nextLevelExp;

    private List<Restaurant> favorites;
    private List<Review> reviews;
}
