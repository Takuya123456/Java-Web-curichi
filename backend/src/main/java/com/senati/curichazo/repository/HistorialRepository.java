package com.senati.curichazo.repository;
import com.senati.curichazo.entity.Historial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface HistorialRepository extends JpaRepository<Historial, Long> {}
