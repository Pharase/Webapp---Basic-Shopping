package back.controller;

import back.entity.Product;
import back.dto.ProductRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import back.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getProducts() {
        return service.findAll();
    }

    @PostMapping
    public Product createProduct(@RequestBody ProductRequest request, HttpSession session) {
        requireAdmin(session);
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody ProductRequest request, HttpSession session) {
        requireAdmin(session);
        return service.update(id, request);
    }

    private void requireAdmin(HttpSession session) {
        if (!"admin".equals(session.getAttribute("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required.");
        }
    }

}
