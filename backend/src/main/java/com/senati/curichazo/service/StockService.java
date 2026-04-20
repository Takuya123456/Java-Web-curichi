package com.senati.curichazo.service;

import com.senati.curichazo.entity.Stock;
import com.senati.curichazo.repository.StockRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final HistorialService historialService;

    public StockService(StockRepository stockRepository, HistorialService historialService) {
        this.stockRepository = stockRepository;
        this.historialService = historialService;
    }

    public List<Stock> listarTodos() {
        return stockRepository.findAll();
    }

    public Stock guardar(Stock stock) {
        actualizarEstadoStock(stock);
        return stockRepository.save(stock);
    }

    public Stock buscarPorId(Long id) {
        return stockRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        Stock s = stockRepository.findById(id).orElse(null);
        if (s != null) {
            historialService.registrar("ELIMINACION_STOCK", "Producto eliminado — " + s.getProducto());
            stockRepository.delete(s);
        }
    }

    private void actualizarEstadoStock(Stock stock) {
        if (stock.getCantidad() <= 0) {
            stock.setEstado("Agotado");
        } else if (stock.getCantidad() <= 5) {
            stock.setEstado("Bajo stock");
        } else {
            stock.setEstado("Disponible");
        }
    }
}