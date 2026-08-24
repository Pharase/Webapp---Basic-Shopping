package back.service;

import back.dto.CategoryRequest;
import back.entity.Category;
import back.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public List<Category> findAll() {
        return repository.findAll();
    }

    public Category ensureByName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Category is required.");
        }
        String cleanName = name.trim();
        return repository.findByNameIgnoreCase(cleanName).orElseGet(() -> {
            Category category = new Category();
            category.setName(cleanName);
            return repository.save(category);
        });
    }

    public Category create(CategoryRequest request) {
        return ensureByName(request.getName());
    }
}
