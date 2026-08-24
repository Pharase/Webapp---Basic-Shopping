package back.controller;

import back.entity.User;
import back.dto.UserRequest;
import back.dto.UserRegistrationRequest;
import back.dto.LoginRequest;
import back.dto.UserResponse;
import jakarta.servlet.http.HttpSession;
import back.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getUsers() {
        return service.findAll();
    }

    @GetMapping("/{user_id}")
    public User getUser(@PathVariable Long user_id) {
        return service.findById(user_id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return service.create(user);
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody UserRegistrationRequest request, HttpSession session) {
        User user = service.register(request);
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("role", user.getRole());
        return new UserResponse(user.getUserId(), user.getUsername(), user.getFullName(), user.getEmail(), user.getRole());
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request, HttpSession session) {
        UserResponse response = service.authenticate(request);
        session.setAttribute("userId", response.getUserId());
        session.setAttribute("role", response.getRole());
        return response;
    }

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }

    @PutMapping("/{user_id}")
    public User updateUser(
            @PathVariable Long user_id,
            @RequestBody UserRequest userRequest
    ) {
        return service.update(user_id, userRequest);
    }

    @DeleteMapping("/{user_id}")
    public void deleteUser(@PathVariable Long user_id) {
        service.delete(user_id);
    }
}
