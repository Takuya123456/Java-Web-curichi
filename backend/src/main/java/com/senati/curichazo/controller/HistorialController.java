package com.senati.curichazo.controller;

import com.senati.curichazo.entity.Historial;
import com.senati.curichazo.service.HistorialService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "*")
public class HistorialController {

    private final HistorialService historialService;

    public HistorialController(HistorialService historialService) {
        this.historialService = historialService;
    }

    // GET /api/historial
    @GetMapping
    public List<Historial> listar() {
        return historialService.listarTodos();
    }
}
