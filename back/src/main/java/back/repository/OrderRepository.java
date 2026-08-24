package back.repository;

import back.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository 
    extends JpaRepository<Order, Long> {
}
