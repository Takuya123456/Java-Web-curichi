package com.senati.curichazo.service;

import com.senati.curichazo.entity.Stock;
import com.senati.curichazo.repository.StockRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final HistorialService historialService;

    public StockService(StockRepository stockRepository,
                        HistorialService historialService) {
        this.stockRepository  = stockRepository;
        this.historialService = historialService;
    }

    public List<Stock> listarTodos() {
        return stockRepository.findAll();
    }

    public Stock guardar(Stock stock) {
        return stockRepository.save(stock);
    }

    public Stock buscarPorId(Long id) {
        return stockRepository.findById(id).orElse(null);
    }

    // Elimina el producto y deja registro en historial
    public void eliminar(Long id) {
        Stock stock = stockRepository.findById(id).orElse(null);
        if (stock != null) {
            historialService.registrar(
                "ELIMINACION_STOCK",
                "Producto eliminado — " + stock.getProducto()
                + " | Cantidad: " + stock.getCantidad()
                + " | Precio: S/ " + stock.getPrecio()
            );
            stockRepository.delete(stock);
        }
    }
}
