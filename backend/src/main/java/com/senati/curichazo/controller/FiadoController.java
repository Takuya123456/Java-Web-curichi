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

    // GET /api/fiados
    @GetMapping
    public List<Fiado> listar() {
        return fiadoService.listarTodos();
    }

    // POST /api/fiados
    @PostMapping
    public Fiado crear(@RequestBody Fiado fiado) {
        return fiadoService.guardar(fiado);
    }

    // PUT /api/fiados/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Fiado> editar(@PathVariable Long id,
                                         @RequestBody Fiado datos) {
        Fiado existente = fiadoService.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setCliente(datos.getCliente());
        existente.setDeuda(datos.getDeuda());
        existente.setFecha(datos.getFecha());
        return ResponseEntity.ok(fiadoService.guardar(existente));
    }

    // DELETE /api/fiados/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        fiadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH /api/fiados/{id}/pagar
    // Mueve el fiado al historial como pagado
    @PatchMapping("/{id}/pagar")
    public ResponseEntity<Historial> marcarPagado(@PathVariable Long id) {
        Historial historial = fiadoService.marcarPagado(id);
        if (historial == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(historial);
    }
}
