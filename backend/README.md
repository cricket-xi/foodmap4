# Campus Foodie Backend (Spring Boot 3)

This is the Spring Boot 3 backend for the Campus Foodie Map application.

## Prerequisites
- Java 17 or higher
- Maven 3.6+

## How to Run
1. Navigate to this directory (`backend`).
2. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start on `http://localhost:8080`.
4. The API endpoints are prefixed with `/api`. For example: `http://localhost:8080/api/restaurants`.
5. H2 Database Console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:campusfoodie`, User: `sa`, Password: `[empty]`).

## API Endpoints
- `GET /api/restaurants` - Get all restaurants (supports `university`, `category`, `query` params)
- `GET /api/restaurants/{id}` - Get restaurant by ID
- `GET /api/users/{id}` - Get user profile
