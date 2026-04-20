package com.senati.curichazo.service;

import com.senati.curichazo.entity.Stock;
import com.senati.curichazo.entity.Venta;
import com.senati.curichazo.repository.StockRepository;
import com.senati.curichazo.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final StockRepository stockRepository;
    private final HistorialService historialService;

    public VentaService(VentaRepository ventaRepository,
                        StockRepository stockRepository,
                        HistorialService historialService) {
        this.ventaRepository = ventaRepository;
        this.stockRepository = stockRepository;
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

        // Actualizar stock
        actualizarStock(venta.getProducto(), venta.getCantidad());

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

    private void actualizarStock(String productoNombre, Integer cantidadVendida) {
        if (productoNombre == null || cantidadVendida == null) return;

        // Buscar el producto en stock
        List<Stock> stocks = stockRepository.findAll();
        Stock producto = stocks.stream()
                .filter(s -> productoNombre.equalsIgnoreCase(s.getProducto()))
                .findFirst()
                .orElse(null);

        if (producto != null) {
            int nuevaCantidad = producto.getCantidad() - cantidadVendida;
            producto.setCantidad(Math.max(0, nuevaCantidad));

            // Actualizar estado automáticamente según cantidad
            if (nuevaCantidad <= 0) {
                producto.setEstado("Agotado");
            } else if (nuevaCantidad <= 5) {
                producto.setEstado("Bajo stock");
            } else {
                producto.setEstado("Disponible");
            }

            stockRepository.save(producto);
        }
    }
}