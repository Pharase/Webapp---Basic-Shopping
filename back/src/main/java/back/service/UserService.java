package back.service;

import back.entity.User;
import back.dto.UserRequest;
import back.dto.UserRegistrationRequest;
import back.dto.LoginRequest;
import back.dto.UserResponse;
import back.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> findAll() {
        return repository.findAll();
    }

    public User findById(Long user_id) {
        return repository.findById(user_id)
                .orElseThrow();
    }

    public User create(User user) {
        return repository.save(user);
    }

    public User register(UserRegistrationRequest request) {
        String username = required(request.getUsername(), "Username");
        String fullName = required(request.getFullName(), "Full name");
        String email = required(request.getEmail(), "Email").toLowerCase();
        String password = required(request.getPassword(), "Password");

        if (repository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already registered.");
        }
        if (repository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole("user");
        return repository.save(user);
    }

    public boolean matchesPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public UserResponse authenticate(LoginRequest request) {
        String email = required(request.getEmail(), "Email").toLowerCase();
        String password = required(request.getPassword(), "Password");
        User user = repository.findByEmail(email)
                .filter(candidate -> matchesPassword(password, candidate.getPasswordHash()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        return new UserResponse(user.getUserId(), user.getUsername(), user.getFullName(), user.getEmail(), user.getRole());
    }

    private String required(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " is required.");
        }
        return value.trim();
    }

    public User update(Long user_id, UserRequest userRequest) {

        User existing = repository.findById(user_id)
                .orElseThrow();

        existing.setUsername(userRequest.getUsername());
        existing.setFullName(userRequest.getFullName());
        existing.setEmail(userRequest.getEmail());

        return repository.save(existing);
    }

    public void delete(Long user_id) {
        repository.deleteById(user_id);
    }
}
