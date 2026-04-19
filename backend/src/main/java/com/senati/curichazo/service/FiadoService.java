package com.senati.curichazo.service;

import com.senati.curichazo.entity.Fiado;
import com.senati.curichazo.entity.Historial;
import com.senati.curichazo.repository.FiadoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FiadoService {

    private final FiadoRepository fiadoRepository;
    private final HistorialService historialService;

    public FiadoService(FiadoRepository fiadoRepository,
                        HistorialService historialService) {
        this.fiadoRepository  = fiadoRepository;
        this.historialService = historialService;
    }

    public List<Fiado> listarTodos() {
        return fiadoRepository.findAll();
    }

    // Guarda el fiado siempre con estado "Pendiente"
    public Fiado guardar(Fiado fiado) {
        fiado.setEstado("Pendiente");
        return fiadoRepository.save(fiado);
    }

    public Fiado buscarPorId(Long id) {
        return fiadoRepository.findById(id).orElse(null);
    }

    // Elimina el fiado y deja registro en historial
    public void eliminar(Long id) {
        Fiado fiado = fiadoRepository.findById(id).orElse(null);
        if (fiado != null) {
            historialService.registrar(
                "ELIMINACION_FIADO",
                "Fiado eliminado — Cliente: " + fiado.getCliente()
                + " | Deuda: S/ " + fiado.getDeuda()
            );
            fiadoRepository.delete(fiado);
        }
    }

    // Marca como pagado: guarda en historial y elimina de fiados
    public Historial marcarPagado(Long id) {
        Fiado fiado = fiadoRepository.findById(id).orElse(null);
        if (fiado == null) return null;

        // 1. Registrar pago en historial
        Historial historial = historialService.registrarPago(
            fiado.getCliente(),
            fiado.getDeuda(),
            fiado.getFecha()
        );

        // 2. Eliminar de fiados pendientes
        fiadoRepository.delete(fiado);

        return historial;
    }
}
