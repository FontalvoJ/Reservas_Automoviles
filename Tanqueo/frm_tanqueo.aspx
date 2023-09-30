<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="frm_tanqueo.aspx.cs" Inherits="Tanqueo.frm_tanqueo" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Inventario de Tanqueo - Brigad XVII</title>

     <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" />

</head>
<body>
    <form id="form1" runat="server">
        <div class="container mt-5">
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <div class="mb-3">
                <h3>Registro de Vales</h3>
            </div>
            <form accept="" class="shadow p-4">                  
                <div class="mb-3">
                    
                    <input type="email" class="form-control" name="username" id="username" placeholder="Username">
                </div>

                <div class="mb-3">
                  
                    <input type="password" class="form-control" name="password" id="Password" placeholder="Password">
                </div>

                <div class="mb-3">
                    <button type="submit" class="btn btn-primary">Login</button>
                </div>

                <hr>

                <p class="text-center mb-0">If you have not account <a href="#">Register Now</a></p>
                
            </form>
        </div>
    </div>
</div>
    </form>
</body>
</html>
