package com.senati.curichazo.repository;
import com.senati.curichazo.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {}
