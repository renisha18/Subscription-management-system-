package com.subscription.repository;

import com.subscription.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findBySubscriberNameContainingIgnoreCase(String name);

    List<Subscription> findByStatus(String status);

    List<Subscription> findByPlanType(String planType);
}
