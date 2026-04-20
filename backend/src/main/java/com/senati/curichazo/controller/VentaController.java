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

    @GetMapping
    public List<Venta> listar() {
        return ventaService.listarTodos();
    }

    @PostMapping
    public Venta crear(@RequestBody Venta venta) {
        return ventaService.guardar(venta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> editar(@PathVariable Long id, @RequestBody Venta datos) {
        Venta v = ventaService.buscarPorId(id);
        if (v == null) {
            return ResponseEntity.notFound().build();
        }
        v.setNombre(datos.getNombre());
        v.setApellido(datos.getApellido());
        v.setProducto(datos.getProducto());
        v.setCantidad(datos.getCantidad());
        v.setPrecio(datos.getPrecio());
        v.setPrecioTotal(datos.getCantidad() * datos.getPrecio());
        v.setFecha(datos.getFecha());
        return ResponseEntity.ok(ventaService.guardar(v));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ventaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}