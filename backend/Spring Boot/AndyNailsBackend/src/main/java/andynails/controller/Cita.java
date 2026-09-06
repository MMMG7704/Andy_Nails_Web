package andynails.controller;

public class Cita {

    private Integer idCita;
    private Integer idUsuarios;
    private String fecha;
    private String hora;
    private String estado;
    private Integer pagoIdPago;

    public Cita() {
    }

    public Cita(Integer idUsuarios, String fecha, String hora) {
        this.idUsuarios = idUsuarios;
        this.fecha = fecha;
        this.hora = hora;
        this.estado = "Pendiente";
    }

    public Integer getIdCita() {
        return idCita;
    }

    public void setIdCita(Integer idCita) {
        this.idCita = idCita;
    }

    public Integer getIdUsuarios() {
        return idUsuarios;
    }

    public void setIdUsuarios(Integer idUsuarios) {
        this.idUsuarios = idUsuarios;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getPagoIdPago() {
        return pagoIdPago;
    }

    public void setPagoIdPago(Integer pagoIdPago) {
        this.pagoIdPago = pagoIdPago;
    }
}