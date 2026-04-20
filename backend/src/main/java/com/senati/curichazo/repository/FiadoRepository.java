package com.senati.curichazo.repository;
import com.senati.curichazo.entity.Fiado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface FiadoRepository extends JpaRepository<Fiado, Long> {}
