package com.senati.curichazo.service;

import com.senati.curichazo.entity.Fiado;
import com.senati.curichazo.entity.Historial;
import com.senati.curichazo.repository.FiadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FiadoService {

    private final FiadoRepository fiadoRepository;
    private final HistorialService historialService;

    public FiadoService(FiadoRepository fiadoRepository, HistorialService historialService) {
        this.fiadoRepository = fiadoRepository;
        this.historialService = historialService;
    }

    public List<Fiado> listarTodos() {
        return fiadoRepository.findAll();
    }

    public Fiado guardar(Fiado fiado) {
        fiado.setEstado("Pendiente");
        System.out.println("=== GUARDANDO FIADO ===");
        System.out.println("Nombre: " + fiado.getNombre());
        System.out.println("Deuda: " + fiado.getDeuda());
        System.out.println("Fecha: " + fiado.getFecha());
        return fiadoRepository.save(fiado);
    }

    public Fiado buscarPorId(Long id) {
        return fiadoRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        Fiado f = fiadoRepository.findById(id).orElse(null);
        if (f != null) {
            historialService.registrar("ELIMINACION_FIADO", "Fiado eliminado — " + f.getNombre());
            fiadoRepository.delete(f);
        }
    }

    @Transactional
    public Historial marcarPagado(Long id) {
        Fiado f = fiadoRepository.findById(id).orElse(null);
        if (f == null) return null;

        Historial h = historialService.registrarPago(f.getNombre(), f.getDeuda(), f.getFecha());
        fiadoRepository.delete(f);
        return h;
    }
}