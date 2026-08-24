package back.service;

import back.dto.CheckoutRequest;
import back.entity.Order;
import back.entity.OrderItem;
import back.entity.Product;
import back.repository.OrderRepository;
import back.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order checkout(Long userId, CheckoutRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty.");
        }

        Order order = new Order();
        order.setUserId(userId);
        BigDecimal total = BigDecimal.ZERO;

        for (CheckoutRequest.CheckoutItem requestedItem : request.getItems()) {
            if (requestedItem.getProductId() == null || requestedItem.getQuantity() == null || requestedItem.getQuantity() < 1) {
                throw new IllegalArgumentException("Invalid cart item.");
            }
            Product product = productRepository.findWithLockById(requestedItem.getProductId()).orElseThrow();
            if (product.getStock() < requestedItem.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock for " + product.getName() + ".");
            }
            product.setStock(product.getStock() - requestedItem.getQuantity());

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setQuantity(requestedItem.getQuantity());
            item.setUnitPrice(product.getPrice());
            order.addItem(item);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(requestedItem.getQuantity())));
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }
}
