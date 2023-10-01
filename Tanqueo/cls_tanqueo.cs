using Sistema_Academico;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace Tanqueo
{
    public class cls_tanqueo
    {
        private string str_mensaje;
        private DateTime fecha;
        private int codigoIngreso;
        private float valorIngreso;
        private string comprobanteEntrega;
        private decimal cantidadGLN;
        private string mtlAeronave;
        private decimal pasan;

        public void fnt_guardarvale(DateTime fecha, int codigoIngreso, float valorIngreso, string comprobanteEntrega, decimal cantidadGLN, string mtlAeronave, decimal pasan)
        {
            try
            {
                cls_conexion objConecta = new cls_conexion();
                SqlCommand con = new SqlCommand("sp_GuardarInformacionVale", objConecta.connection);
                con.CommandType = CommandType.StoredProcedure;
                con.Parameters.AddWithValue("@Fecha", fecha);
                con.Parameters.AddWithValue("@FKCodigo_tbl_Ingreso", codigoIngreso);
                con.Parameters.AddWithValue("@Valor_Ingreso", valorIngreso);
                con.Parameters.AddWithValue("@Comprobante_entrega", comprobanteEntrega);
                con.Parameters.AddWithValue("@Cantidad_GLN", cantidadGLN);
                con.Parameters.AddWithValue("@Mtl_Aeronave", mtlAeronave);
                objConecta.connection.Open();
                con.ExecuteNonQuery();
                objConecta.connection.Close();
                str_mensaje = "Registro exitoso";
            }
            catch (Exception ex)
            {
                str_mensaje = "Error: " + ex.Message;
            }
        }

        public string getMensaje() { return this.str_mensaje; }

        public DateTime getFecha() { return this.fecha; }

        public int getCodigoIngreso() { return this.codigoIngreso; }

        public float getValorIngreso() { return this.valorIngreso; }

        public string getComprobanteEntrega() { return this.comprobanteEntrega; }

        public decimal getCantidadGLN() { return this.cantidadGLN; }

        public string getMtlAeronave() { return this.mtlAeronave; }

        public decimal getPasan() { return this.pasan; }
    }
}
