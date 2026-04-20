package com.senati.curichazo.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonAlias;  // ← IMPORTAR ESTO

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

    @Column(name = "precio_total", nullable = false)
    @JsonAlias({"total", "precioTotal"})  // ← SOLO AGREGAR ESTA LÍNEA
    private Double precioTotal;

    @Column(nullable = false)
    private String fecha;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = true)
    private Cliente cliente;

    // Getters y Setters (igual que antes)
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
    public Double getPrecioTotal() { return precioTotal; }
    public void setPrecioTotal(Double precioTotal) { this.precioTotal = precioTotal; }
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}