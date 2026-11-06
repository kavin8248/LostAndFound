package com.mce.lostandfound;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LostItemService {
	private final LostItemRepository repository;

	public LostItemService(LostItemRepository repository) {
		super();
		this.repository = repository;
	}
	public List<LostItem> getAllItems(){
		return repository.findAll();
	}
	public LostItem getItem(Long id) {
		return repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item Not Found"));
	}
	public LostItem addItem(LostItem item) {
		return repository.save(item);
	}
	public LostItem updateItem(Long id,LostItem item) {
		LostItem existingItem = repository.findById(id).orElseThrow(				
	()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Item not found")
				);
		existingItem.setItemname(item.getItemname());
		existingItem.setDescription(item.getDescription());
		existingItem.setLocation(item.getLocation());
		existingItem.setContact(item.getContact());
		
		return repository.save(existingItem);
	}
	public void deleteItem(Long id) {
		repository.deleteById(id);
	}
	public List<LostItem> searachItems(String itemname){
		return repository.findByItemnameContainingIgnoreCase(itemname);
	}
	public Page<LostItem> getItemsWithPagination(int page, int size) {
	    Pageable pageable = PageRequest.of(page, size);
	    return repository.findAll(pageable);
	}
	

}
