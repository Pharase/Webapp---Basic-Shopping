package back.service;

import back.entity.Product;
import back.dto.ProductRequest;
import back.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository repository, CategoryService categoryService) {
        this.repository = repository;
        this.categoryService = categoryService;
    }

    public List<Product> findAll() {
        return repository.findAll();
    }

    public Product create(ProductRequest request) {
        Product product = new Product();
        apply(product, request);
        return repository.save(product);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = repository.findById(id).orElseThrow();
        apply(product, request);
        return repository.save(product);
    }

    private void apply(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setDetail(request.getDetail());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setCategoryId(categoryService.ensureByName(request.getCategoryName()).getId());
    }
}
