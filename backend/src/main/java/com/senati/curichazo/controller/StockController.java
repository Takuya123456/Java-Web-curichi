package com.senati.curichazo.controller;

import com.senati.curichazo.entity.Stock;
import com.senati.curichazo.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // GET /api/stock
    @GetMapping
    public List<Stock> listar() {
        return stockService.listarTodos();
    }

    // POST /api/stock
    @PostMapping
    public Stock crear(@RequestBody Stock stock) {
        return stockService.guardar(stock);
    }

    // PUT /api/stock/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Stock> editar(@PathVariable Long id,
                                         @RequestBody Stock datos) {
        Stock existente = stockService.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setProducto(datos.getProducto());
        existente.setCantidad(datos.getCantidad());
        existente.setPrecio(datos.getPrecio());
        existente.setEstado(datos.getEstado());
        return ResponseEntity.ok(stockService.guardar(existente));
    }

    // DELETE /api/stock/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        stockService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
