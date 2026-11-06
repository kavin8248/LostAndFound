package com.mce.lostandfound;

import java.util.List;

import org.springframework.data.domain.Page;
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

@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://lost-and-found-six-mu.vercel.app"
})
@RestController
@RequestMapping("/api/items")
public class LostItemController {
	private final LostItemService service;

	public LostItemController(LostItemService service) {
		super();
		this.service = service;
	}

	@GetMapping
	public List<LostItem> getAllItems() {
		return service.getAllItems();
	}

	@GetMapping("/{id}")
	public LostItem getItem(@PathVariable Long id) {
		return service.getItem(id);
	}

	@PostMapping
	public LostItem addItem(@Valid @RequestBody LostItem item) {
		return service.addItem(item);
	}

	@PutMapping("/{id}")
	public LostItem updateItem(@PathVariable Long id, @Valid @RequestBody LostItem item) {
		return service.updateItem(id, item);
	}

	@DeleteMapping("/{id}")
	public void deleteItem(@PathVariable Long id) {
		service.deleteItem(id);
	}

	@GetMapping("/search")
	public List<LostItem> searchitems(@RequestParam String itemname) {
		return service.searachItems(itemname);
	}

	@GetMapping("/page")
	public Page<LostItem> getItemsWithPagination(@RequestParam int page, @RequestParam int size) {

		return service.getItemsWithPagination(page, size);
	}

}
