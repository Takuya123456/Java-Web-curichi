package com.senati.curichazo.entity;

import jakarta.persistence.*;

// Guarda TODOS los eventos:
// - Pagos de fiados
// - Eliminaciones de clientes, ventas, fiados, stock
@Entity
@Table(name = "historial")
public class Historial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "historial_id")
    private Long id;

    // Tipo: "PAGO_FIADO", "ELIMINACION_CLIENTE",
    //       "ELIMINACION_VENTA", "ELIMINACION_FIADO", "ELIMINACION_STOCK"
    @Column(nullable = false)
    private String tipo;

    // Descripcion detallada de lo que ocurrio
    @Column(nullable = false, length = 500)
    private String descripcion;

    // Fecha del evento
    @Column(nullable = false)
    private String fecha;

    // Campos extra solo para pagos de fiado
    private String cliente;
    private Double deuda;
    private String fechaFiado;
    private String fechaPago;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public Double getDeuda() { return deuda; }
    public void setDeuda(Double deuda) { this.deuda = deuda; }
    public String getFechaFiado() { return fechaFiado; }
    public void setFechaFiado(String fechaFiado) { this.fechaFiado = fechaFiado; }
    public String getFechaPago() { return fechaPago; }
    public void setFechaPago(String fechaPago) { this.fechaPago = fechaPago; }
}
