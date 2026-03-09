package com.subscription.controller;

import com.subscription.model.Subscription;
import com.subscription.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    private final SubscriptionService service;

    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    // POST /subscriptions — Add new subscription
    @PostMapping
    public ResponseEntity<Subscription> addSubscription(
            @Valid @RequestBody Subscription subscription) {
        return ResponseEntity.ok(service.addSubscription(subscription));
    }

    // GET /subscriptions — Get all subscriptions
    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions() {
        return ResponseEntity.ok(service.getAllSubscriptions());
    }

    // GET /subscriptions/{id} — Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getById(@PathVariable Long id) {
        return service.getSubscriptionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // GET /subscriptions/search?name=alice — Search by name
    @GetMapping("/search")
    public ResponseEntity<List<Subscription>> searchByName(
            @RequestParam String name) {
        return ResponseEntity.ok(service.searchByName(name));
    }

    // GET /subscriptions/status?status=Active — Filter by status
    @GetMapping("/status")
    public ResponseEntity<List<Subscription>> filterByStatus(
            @RequestParam String status) {
        return ResponseEntity.ok(service.filterByStatus(status));
    }

    // PUT /subscriptions/{id} — Update subscription
    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(
            @PathVariable Long id,
            @Valid @RequestBody Subscription subscription) {
        return ResponseEntity.ok(service.updateSubscription(id, subscription));
    }

    // DELETE /subscriptions/{id} — Delete subscription
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubscription(@PathVariable Long id) {
        service.deleteSubscription(id);
        return ResponseEntity.ok("Subscription deleted successfully.");
    }
}
