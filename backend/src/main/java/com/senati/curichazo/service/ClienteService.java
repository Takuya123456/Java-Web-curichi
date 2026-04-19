package com.senati.curichazo.service;

import com.senati.curichazo.entity.Cliente;
import com.senati.curichazo.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final com.senati.curichazo.service.HistorialService historialService;

    public ClienteService(ClienteRepository clienteRepository,
                          HistorialService historialService) {
        this.clienteRepository = clienteRepository;
        this.historialService  = historialService;
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    // Elimina el cliente y deja registro en historial
    public void eliminar(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElse(null);
        if (cliente != null) {
            historialService.registrar(
                "ELIMINACION_CLIENTE",
                "Cliente eliminado — " + cliente.getNombre()
                + " " + cliente.getApellido()
                + " | Tel: " + cliente.getTelefono()
            );
            clienteRepository.delete(cliente);
        }
    }
}
