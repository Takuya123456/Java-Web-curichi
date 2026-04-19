package com.senati.curichazo.controller;

import com.senati.curichazo.entity.Cliente;
import com.senati.curichazo.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // GET /api/clientes
    @GetMapping
    public List<Cliente> listar() {
        return clienteService.listarTodos();
    }

    // POST /api/clientes
    @PostMapping
    public Cliente crear(@RequestBody Cliente cliente) {
        return clienteService.guardar(cliente);
    }

    // PUT /api/clientes/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> editar(@PathVariable Long id,
                                           @RequestBody Cliente datos) {
        Cliente existente = clienteService.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setNombre(datos.getNombre());
        existente.setApellido(datos.getApellido());
        existente.setTelefono(datos.getTelefono());
        return ResponseEntity.ok(clienteService.guardar(existente));
    }

    // DELETE /api/clientes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
