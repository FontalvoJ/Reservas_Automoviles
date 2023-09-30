<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="frm_tanqueo.aspx.cs" Inherits="Tanqueo.frm_tanqueo" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Inventario de Tanqueo - Brigad XVII</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" />

</head>
<body>
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="mb-2">
                        <h3>Registro de Vales</h3>
                    </div>
                    <form runat="server" class="shadow p-4">
                        <div class="mb-2">
                            <asp:TextBox ID="txt_fecha" placeholder="Fecha" class="form-control"  runat="server"></asp:TextBox>
                        </div>

                        <div class="mb-2">
                            <asp:DropDownList ID="ddl_ingreso"  placeholder="Ingreso" class="form-control" DataTextField="Descripcion" DataValueField="PKCodigo" DataSourceID="SqlDataSourceIngreso" runat="server"></asp:DropDownList>
                            <asp:SqlDataSource ID="sqlDataSourceIngreso" runat="server" ConnectionString="<%$ ConnectionStrings:dbs_registro_tanqueoConnectionString %>" SelectCommand="SELECT [PKCodigo], [Descripcion] FROM [tbl_ingreso]"></asp:SqlDataSource>
                    
                            </div>

                        <div class="mb-2">
                            <asp:TextBox ID="txt_comprobante"  placeholder="Comprobante" class="form-control" runat="server" ></asp:TextBox>
                        </div>

                        <div class="mb-2">
                            <asp:TextBox ID="txt_cantidad"  placeholder="Galones" class="form-control" runat="server"></asp:TextBox>
                        </div>

                        <div class="mb-2">
                            <asp:TextBox ID="txt_matricula"  placeholder="Matricula Aeronave" class="form-control" runat="server"></asp:TextBox>
                        </div>

                        <div class="mb-2">
                            <asp:TextBox ID="txt_pasan"  placeholder="Pasan" class="form-control" runat="server"></asp:TextBox>
                        </div>

                        <div class="mb-2">
                            <asp:Button ID="btn_guardar" Text="Guardar"  class="btn btn-dark btn-md mr-2" runat="server" />
         
                        </div>

                        <div class="form-outline mb-2">
                            <asp:Label ID="lbl_mensaje" runat="server" Text="" class="form-control form-control-sm"></asp:Label>
                                   

                        </div>

                        <hr>

                        <p class="text-center mb-0">Este proyecto estara bajo licencia y derechos de autor propiedad de FontalvoJ</p>

                    </form>
                </div>
            </div>
        </div>
</body>
</html>
