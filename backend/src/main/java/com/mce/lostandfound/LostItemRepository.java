package com.mce.lostandfound;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LostItemRepository extends JpaRepository<LostItem, Long>{
	List<LostItem> findByItemnameContainingIgnoreCase(String itemname);

}
