package com.senati.curichazo.controller;

import com.senati.curichazo.entity.Fiado;
import com.senati.curichazo.entity.Historial;
import com.senati.curichazo.service.FiadoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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
            System.out.println("=== CREANDO FIADO ===");
            Fiado nuevo = fiadoService.guardar(fiado);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear fiado: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id,
                                    @RequestBody Fiado datos) {
        try {
            Fiado f = fiadoService.buscarPorId(id);
            if (f == null) {
                return ResponseEntity.notFound().build();
            }
            f.setNombre(datos.getNombre());
            f.setDeuda(datos.getDeuda());
            f.setFecha(datos.getFecha());
            return ResponseEntity.ok(fiadoService.guardar(f));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al editar fiado: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            System.out.println("=== DELETE FIADO ID: " + id + " ===");
            fiadoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar fiado: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<?> marcarPagado(@PathVariable Long id) {
        try {
            Historial h = fiadoService.marcarPagado(id);
            if (h == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(h);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al marcar pagado: " + e.getMessage()));
        }
    }
}