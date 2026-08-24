package back.controller;

import back.dto.CategoryRequest;
import back.entity.Category;
import back.service.CategoryService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {
    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Category> getCategories() {
        return service.findAll();
    }

    @PostMapping
    public Category createCategory(@RequestBody CategoryRequest request, HttpSession session) {
        requireAdmin(session);
        return service.create(request);
    }

    private void requireAdmin(HttpSession session) {
        if (!"admin".equals(session.getAttribute("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required.");
        }
    }
}
