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

    @GetMapping
    public List<Stock> listar() { return stockService.listarTodos(); }

    @PostMapping
    public Stock crear(@RequestBody Stock stock) {
        return stockService.guardar(stock);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> editar(@PathVariable Long id,
                                         @RequestBody Stock datos) {
        Stock s = stockService.buscarPorId(id);
        if (s == null) return ResponseEntity.notFound().build();
        s.setProducto(datos.getProducto());
        s.setCantidad(datos.getCantidad());
        s.setPrecio(datos.getPrecio());
        s.setEstado(datos.getEstado());
        return ResponseEntity.ok(stockService.guardar(s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        stockService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
