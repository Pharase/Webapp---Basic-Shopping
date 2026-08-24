package back.repository;

import back.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface ProductRepository 
        extends JpaRepository<Product, Long> {

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        Optional<Product> findWithLockById(Long id);
}
