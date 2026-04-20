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

    public FiadoService(FiadoRepository fiadoRepository,
                        HistorialService historialService) {
        this.fiadoRepository  = fiadoRepository;
        this.historialService = historialService;
    }

    public List<Fiado> listarTodos() {
        return fiadoRepository.findAll();
    }

    public Fiado guardar(Fiado fiado) {
        fiado.setEstado("Pendiente");
        System.out.println("=== GUARDANDO FIADO ===");
        System.out.println("Cliente: " + fiado.getNombre());
        System.out.println("Deuda: " + fiado.getDeuda());
        return fiadoRepository.save(fiado);
    }

    public Fiado buscarPorId(Long id) {
        return fiadoRepository.findById(id).orElse(null);
    }

    @Transactional
    public void eliminar(Long id) {
        try {
            System.out.println("=== ELIMINANDO FIADO ID: " + id + " ===");
            Fiado f = fiadoRepository.findById(id).orElse(null);
            if (f == null) {
                System.out.println("❌ Fiado no encontrado");
                throw new RuntimeException("Fiado no encontrado con ID: " + id);
            }

            System.out.println("Fiado encontrado: " + f.getNombre() + " - Deuda: " + f.getDeuda());

            historialService.registrar(
                    "ELIMINACION_FIADO",
                    "Fiado eliminado — " + f.getNombre()
                            + " | Deuda: S/ " + f.getDeuda()
            );

            fiadoRepository.delete(f);
            System.out.println("✅ Fiado eliminado correctamente");

        } catch (Exception e) {
            System.err.println("❌ Error al eliminar fiado: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al eliminar fiado: " + e.getMessage());
        }
    }

    // Marca como pagado → guarda en historial → elimina de fiados
    @Transactional
    public Historial marcarPagado(Long id) {
        try {
            System.out.println("=== MARCANDO FIADO COMO PAGADO ID: " + id + " ===");
            Fiado f = fiadoRepository.findById(id).orElse(null);
            if (f == null) {
                System.out.println("❌ Fiado no encontrado");
                return null;
            }

            System.out.println("Procesando pago de: " + f.getNombre() + " - S/ " + f.getDeuda());

            Historial h = historialService.registrarPago(
                    f.getNombre(), f.getDeuda(), f.getFecha()
            );

            fiadoRepository.delete(f);
            System.out.println("✅ Pago registrado y fiado eliminado");
            return h;

        } catch (Exception e) {
            System.err.println("❌ Error al marcar pagado: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al marcar pagado: " + e.getMessage());
        }
    }
}