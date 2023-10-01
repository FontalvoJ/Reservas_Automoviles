using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Tanqueo
{
    public partial class frm_tanqueo : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                // Estado inicial cuando la página se carga por primera vez
                ddl_ingreso_SelectedIndexChanged(null, null);
            }
        }

        protected void ddl_ingreso_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (ddl_ingreso.SelectedValue == "2")
            {
                // Si el usuario selecciona "SI", deshabilita el campo de txt_cantidad y habilita el campo de txt_ingreso
                txt_cantidad.ReadOnly = true;
                txt_ingreso.ReadOnly = false;
            }
            else if (ddl_ingreso.SelectedValue == "1")
            {
                // Si el usuario selecciona "No", deshabilita el campo de txt_ingreso y habilita el campo de txt_cantidad
                txt_cantidad.ReadOnly = false;
                txt_ingreso.ReadOnly = true;
            }
            else
            {
                // Si selecciona otra opción, ambos campos están habilitados
                txt_cantidad.ReadOnly = false;
                txt_ingreso.ReadOnly = false;
            }
        }

        protected void btn_guardar_Click(object sender, EventArgs e)
        {
            cls_tanqueo objVale = new cls_tanqueo();

            DateTime fecha;
            if (!DateTime.TryParse(txt_fecha.Text, out fecha))
            {
                lbl_mensaje.Text = "Error: La fecha ingresada no es válida.";
                return;
            }

            int codigoIngreso;
            if (!int.TryParse(ddl_ingreso.SelectedValue, out codigoIngreso))
            {
                lbl_mensaje.Text = "Error: El valor de ingreso seleccionado no es válido.";
                return;
            }

            float valorIngreso = 0; // Inicializamos a 0 en caso de que el usuario seleccione "No"

            if (ddl_ingreso.SelectedValue == "2") // Si el usuario selecciona "Sí"
            {
                if (!float.TryParse(txt_ingreso.Text, out valorIngreso))
                {
                    lbl_mensaje.Text = "Error: El valor de ingreso no es válido.";
                    return;
                }
            }

            string comprobanteEntrega = txt_comprobante.Text;

            decimal cantidadGLN = 0; // Inicializamos a 0 en caso de que el usuario seleccione "Sí"

            if (ddl_ingreso.SelectedValue != "2") // Si el usuario no selecciona "Sí"
            {
                string cantidadGLNStr = txt_cantidad.Text.Trim(); // Eliminar espacios en blanco al principio y al final

                // Reemplazar comas por puntos en el valor ingresado (si es necesario)
                cantidadGLNStr = cantidadGLNStr.Replace(",", ".");

                if (!decimal.TryParse(cantidadGLNStr, out cantidadGLN))
                {
                    lbl_mensaje.Text = "Error: La cantidad de GLN ingresada no es un número válido.";
                    return;
                }

                // Verificar si la cantidad es negativa y mostrar un mensaje de error si es necesario
                if (cantidadGLN < 0)
                {
                    lbl_mensaje.Text = "Error: La cantidad de GLN no puede ser un número negativo.";
                    return;
                }
            }

            string mtlAeronave = txt_matricula.Text;

            // Llama al método fnt_guardarvale de la clase cls_tanqueo y verifica si se realizó con éxito.
            objVale.fnt_guardarvale(fecha, codigoIngreso, valorIngreso, comprobanteEntrega, cantidadGLN, mtlAeronave, 0);

            lbl_mensaje.Text = objVale.getMensaje();

            // Obtén el valor de pasan después de realizar la inserción en la base de datos
            decimal pasan = objVale.getPasan();

            // Muestra el valor de Pasan en lbl_pasan.Text
            lbl_pasan.Text = pasan.ToString();
        }

        protected void btn_nuevo_Click(object sender, EventArgs e)
        {
            // Restablecer los campos del formulario a sus valores iniciales
            txt_fecha.Text = string.Empty;
            ddl_ingreso.SelectedIndex = 0;
            txt_ingreso.Text = string.Empty;
            txt_comprobante.Text = string.Empty;
            txt_cantidad.Text = string.Empty;
            txt_matricula.Text = string.Empty;
            lbl_pasan.Text = string.Empty;
            lbl_mensaje.Text = string.Empty;

            // Enfocar el campo txt_fecha para que el usuario pueda comenzar a ingresar datos nuevamente si es necesario
            txt_fecha.Focus();

        }
    }
}
