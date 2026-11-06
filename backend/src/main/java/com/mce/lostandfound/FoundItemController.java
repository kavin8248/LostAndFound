package com.mce.lostandfound;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@Validated
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/found-items")
public class FoundItemController {
	@Autowired
	private FoundItemService service;

	@GetMapping
	public List<FoundItem> getAllItems() {
		return service.getAllItems();
	}

	@GetMapping("/{id}")
	public FoundItem getItem(@PathVariable Long id) {
		return service.getItem(id);
	}

	@PostMapping
	public FoundItem addItem(@Valid @RequestBody FoundItem item) {
		return service.addItem(item);
	}

	@PutMapping("/{id}")
	public FoundItem updateItem(@PathVariable Long id, @Valid @RequestBody FoundItem item) {
		return service.updateItem(id, item);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
		service.deleteItem(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/search")
	public List<FoundItem> searchItems(@RequestParam String itemname) {

		return service.searchItems(itemname);
	}
}
