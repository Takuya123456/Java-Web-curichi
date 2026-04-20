package com.senati.curichazo.service;

import com.senati.curichazo.entity.Cliente;
import com.senati.curichazo.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final HistorialService historialService;

    public ClienteService(ClienteRepository clienteRepository,
                          HistorialService historialService) {
        this.clienteRepository = clienteRepository;
        this.historialService  = historialService;
    }

    public List<Cliente> listarTodos() { return clienteRepository.findAll(); }

    public Cliente guardar(Cliente cliente) { return clienteRepository.save(cliente); }

    public Cliente buscarPorId(Long id) { return clienteRepository.findById(id).orElse(null); }

    public void eliminar(Long id) {
        Cliente c = clienteRepository.findById(id).orElse(null);
        if (c != null) {
            historialService.registrar(
                "ELIMINACION_CLIENTE",
                "Cliente eliminado — " + c.getNombre() + " " + c.getApellido()
                + " | Tel: " + c.getTelefono()
            );
            clienteRepository.delete(c);
        }
    }
}
