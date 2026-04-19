package com.senati.curichazo.service;

import com.senati.curichazo.entity.Historial;
import com.senati.curichazo.repository.HistorialRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class HistorialService {

    private final HistorialRepository historialRepository;

    public HistorialService(HistorialRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    // Retorna todos los registros del historial
    public List<Historial> listarTodos() {
        return historialRepository.findAll();
    }

    // Registra cualquier eliminacion en el historial
    public void registrar(String tipo, String descripcion) {
        Historial h = new Historial();
        h.setTipo(tipo);
        h.setDescripcion(descripcion);
        h.setFecha(hoy());
        historialRepository.save(h);
    }

    // Registra un pago de fiado con todos los detalles
    public Historial registrarPago(String clienteNombre, Double deuda,
                                    String fechaFiado) {
        Historial h = new Historial();
        h.setTipo("PAGO_FIADO");
        h.setDescripcion("Fiado pagado — Cliente: " + clienteNombre
                + " | Deuda: S/ " + deuda);
        h.setFecha(hoy());
        h.setCliente(clienteNombre);
        h.setDeuda(deuda);
        h.setFechaFiado(fechaFiado);
        h.setFechaPago(hoy());
        return historialRepository.save(h);
    }

    private String hoy() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
}
