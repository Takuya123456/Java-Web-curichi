package com.senati.curichazo.controller;

import com.senati.curichazo.entity.Venta;
import com.senati.curichazo.service.VentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    // GET /api/ventas
    @GetMapping
    public List<Venta> listar() {
        return ventaService.listarTodos();
    }

    // POST /api/ventas
    @PostMapping
    public Venta crear(@RequestBody Venta venta) {
        return ventaService.guardar(venta);
    }

    // PUT /api/ventas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Venta> editar(@PathVariable Long id,
                                         @RequestBody Venta datos) {
        Venta existente = ventaService.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setNombre(datos.getNombre());
        existente.setApellido(datos.getApellido());
        existente.setProducto(datos.getProducto());
        existente.setCantidad(datos.getCantidad());
        existente.setPrecio(datos.getPrecio());
        existente.setTotal(datos.getTotal());
        existente.setFecha(datos.getFecha());
        return ResponseEntity.ok(ventaService.guardar(existente));
    }

    // DELETE /api/ventas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ventaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
