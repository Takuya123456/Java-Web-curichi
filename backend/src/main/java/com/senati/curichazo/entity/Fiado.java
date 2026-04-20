package com.senati.curichazo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fiado")
public class Fiado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fiado_id")
    private Long id;

    // Nombre directo, sin FK
    @Column(nullable = false)
    private String nombre;

    // Deuda directa
    @Column(nullable = false)
    private Double deuda;

    @Column(nullable = false)
    private String fecha;

    // "Pendiente" o "Pagado"
    @Column(nullable = false)
    private String estado;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Double getDeuda() { return deuda; }
    public void setDeuda(Double deuda) { this.deuda = deuda; }
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
