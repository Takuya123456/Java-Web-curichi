package com.senati.curichazo.service;

import com.senati.curichazo.entity.Venta;
import com.senati.curichazo.repository.VentaRepository;
import org.springframework.stereotype.Service;
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

    public Venta guardar(Venta venta) {
        venta.calcularTotal();        // ← TOTAL SE CALCULA AUTOMÁTICAMENTE
        return ventaRepository.save(venta);
    }

    public Venta buscarPorId(Long id) {
        return ventaRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        Venta venta = ventaRepository.findById(id).orElse(null);
        if (venta != null) {
            historialService.registrar(
                    "ELIMINACION_VENTA",
                    "Venta eliminada — " + venta.getNombre() + " " + venta.getApellido() +
                            " | Producto: " + venta.getProducto() +
                            " | Total: S/ " + venta.getTotal()
            );
            ventaRepository.delete(venta);
        }
    }
}