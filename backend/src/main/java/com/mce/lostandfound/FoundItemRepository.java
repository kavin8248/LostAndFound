package com.mce.lostandfound;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {
	List<FoundItem> findByItemnameContainingIgnoreCase(String itemname);
}
