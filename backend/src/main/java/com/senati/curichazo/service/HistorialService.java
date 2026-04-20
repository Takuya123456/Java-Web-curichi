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

    public List<Historial> listarTodos() {
        return historialRepository.findAll();
    }

    // Registra cualquier eliminacion
    public void registrar(String tipo, String descripcion) {
        Historial h = new Historial();
        h.setTipo(tipo);
        h.setDescripcion(descripcion);
        h.setFecha(hoy());
        historialRepository.save(h);
    }

    // Registra un pago de fiado con detalle completo
    public Historial registrarPago(String nombre, Double deuda, String fechaFiado) {
        Historial h = new Historial();
        h.setTipo("PAGO_FIADO");
        h.setDescripcion("Fiado pagado — " + nombre + " | S/ " + deuda);
        h.setFecha(hoy());
        h.setNombre(nombre);
        h.setDeuda(deuda);
        h.setFechaFiado(fechaFiado);
        h.setFechaPago(hoy());
        return historialRepository.save(h);
    }

    private String hoy() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
}
