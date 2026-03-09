package com.subscription.service;

import com.subscription.model.Subscription;
import com.subscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    private final SubscriptionRepository repository;

    public SubscriptionService(SubscriptionRepository repository) {
        this.repository = repository;
    }

    public Subscription addSubscription(Subscription subscription) {
        return repository.save(subscription);
    }

    public List<Subscription> getAllSubscriptions() {
        return repository.findAll();
    }

    public Optional<Subscription> getSubscriptionById(Long id) {
        return repository.findById(id);
    }

    public Subscription updateSubscription(Long id, Subscription updated) {
        Subscription existing = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subscription not found with id: " + id));

        existing.setSubscriberName(updated.getSubscriberName());
        existing.setEmail(updated.getEmail());
        existing.setPlanType(updated.getPlanType());
        existing.setStatus(updated.getStatus());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());

        return repository.save(existing);
    }

    public void deleteSubscription(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Subscription not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public List<Subscription> searchByName(String name) {
        return repository.findBySubscriberNameContainingIgnoreCase(name);
    }

    public List<Subscription> filterByStatus(String status) {
        return repository.findByStatus(status);
    }
}
