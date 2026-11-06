package com.mce.lostandfound;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FoundItemService {
	@Autowired
	private FoundItemRepository repository;

	public FoundItemService(FoundItemRepository repository) {
		super();
		this.repository = repository;
	}

	public List<FoundItem> getAllItems() {
		return repository.findAll();
	}

	public FoundItem getItem(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Found item not found"));
	}

	public FoundItem addItem(FoundItem item) {
		return repository.save(item);
	}

	public FoundItem updateItem(Long id, FoundItem item) {
		FoundItem existingItem = repository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Found item not found"));
		existingItem.setItemname(item.getItemname());
		existingItem.setDescription(item.getDescription());
		existingItem.setLocation(item.getLocation());
		existingItem.setDate(item.getDate());

		return repository.save(existingItem);
	}

	public void deleteItem(Long id) {
		if (!repository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "found item not found");
		}
		repository.deleteById(id);
	}

	public List<FoundItem> searchItems(String itemname) {
		return repository.findByItemnameContainingIgnoreCase(itemname);
	}
}
