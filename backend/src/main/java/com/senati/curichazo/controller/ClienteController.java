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

    @GetMapping
    public List<Cliente> listar() { return clienteService.listarTodos(); }

    @PostMapping
    public Cliente crear(@RequestBody Cliente cliente) {
        return clienteService.guardar(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> editar(@PathVariable Long id,
                                           @RequestBody Cliente datos) {
        Cliente c = clienteService.buscarPorId(id);
        if (c == null) return ResponseEntity.notFound().build();
        c.setNombre(datos.getNombre());
        c.setApellido(datos.getApellido());
        c.setTelefono(datos.getTelefono());
        return ResponseEntity.ok(clienteService.guardar(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
