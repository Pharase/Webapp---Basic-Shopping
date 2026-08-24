package back.repository;

import back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

        @Query("select count(u) > 0 from User u where u.username = :username")
        boolean existsByUsername(@Param("username") String username);

        @Query("select count(u) > 0 from User u where u.email = :email")
        boolean existsByEmail(@Param("email") String email);

        @Query("select u from User u where u.email = :email")
        Optional<User> findByEmail(@Param("email") String email);

}
