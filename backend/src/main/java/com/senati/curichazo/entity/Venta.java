package com.senati.curichazo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "venta")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "venta_id")
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false)
    private String producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false)
    private String fecha;

    // ==================== CAMPO PARA EL FRONTEND ====================
    @JsonProperty("comprador")   // ←←← Esto fuerza el nombre en el JSON
    public String getComprador() {
        return (nombre != null ? nombre.trim() : "")
                + " "
                + (apellido != null ? apellido.trim() : "");
    }

    // ==================== CÁLCULO AUTOMÁTICO DEL TOTAL ====================
    public void calcularTotal() {
        if (this.cantidad != null && this.precio != null) {
            this.total = this.cantidad * this.precio;
        } else {
            this.total = 0.0;
        }
    }

    // Getters y Setters (sin cambios)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getProducto() { return producto; }
    public void setProducto(String producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
}