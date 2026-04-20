package com.senati.curichazo.service;

import com.senati.curichazo.entity.Venta;
import com.senati.curichazo.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final HistorialService historialService;

    public VentaService(VentaRepository ventaRepository, HistorialService historialService) {
        this.ventaRepository = ventaRepository;
        this.historialService = historialService;
    }

    public List<Venta> listarTodos() {
        return ventaRepository.findAll();
    }

    @Transactional
    public Venta guardar(Venta venta) {
        // Calcular el total
        if (venta.getCantidad() != null && venta.getPrecio() != null) {
            venta.setPrecioTotal(venta.getCantidad() * venta.getPrecio());
        }
        return ventaRepository.save(venta);
    }

    public Venta buscarPorId(Long id) {
        return ventaRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        Venta v = ventaRepository.findById(id).orElse(null);
        if (v != null) {
            historialService.registrar(
                    "ELIMINACION_VENTA",
                    "Venta eliminada — " + v.getNombre() + " " + v.getApellido()
            );
            ventaRepository.delete(v);
        }
    }
}