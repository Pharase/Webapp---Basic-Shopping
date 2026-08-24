package back.dto;

public class UserResponse {

    private Long user_id;
    private String username;
    private String full_name;
    private String email;
    private String role;

    public UserResponse(Long user_id, String username, String full_name, String email, String role) {
        this.user_id = user_id;
        this.username = username;
        this.full_name = full_name;
        this.email = email;
        this.role = role;
    }

    public Long getUserId() {
        return user_id;
    }

    public String getUsername() {
        return username;
    }
    public String getFullName() {
        return full_name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}