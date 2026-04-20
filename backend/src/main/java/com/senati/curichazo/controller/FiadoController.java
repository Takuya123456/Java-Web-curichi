package com.senati.curichazo.controller;

import com.senati.curichazo.entity.Fiado;
import com.senati.curichazo.entity.Historial;
import com.senati.curichazo.service.FiadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fiados")
@CrossOrigin(origins = "*")
public class FiadoController {

    private final FiadoService fiadoService;

    public FiadoController(FiadoService fiadoService) {
        this.fiadoService = fiadoService;
    }

    @GetMapping
    public List<Fiado> listar() {
        return fiadoService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Fiado fiado) {
        try {
            Fiado nuevo = fiadoService.guardar(fiado);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fiado> editar(@PathVariable Long id, @RequestBody Fiado datos) {
        Fiado f = fiadoService.buscarPorId(id);
        if (f == null) {
            return ResponseEntity.notFound().build();
        }
        f.setNombre(datos.getNombre());
        f.setDeuda(datos.getDeuda());
        f.setFecha(datos.getFecha());
        return ResponseEntity.ok(fiadoService.guardar(f));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        fiadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<Historial> marcarPagado(@PathVariable Long id) {
        Historial h = fiadoService.marcarPagado(id);
        if (h == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(h);
    }
}