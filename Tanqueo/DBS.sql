
CREATE DATABASE  dbs_registro_tanqueo;

USE dbs_registro_tanqueo;

CREATE TABLE tbl_ingreso (
    PKCodigo INT PRIMARY KEY,
    Descripcion VARCHAR(255)
);

INSERT INTO tbl_ingreso (PKCodigo, Descripcion) VALUES
(1, 'No'),
(2, 'Si');

CREATE TABLE tbl_vales (
    PKId INT PRIMARY KEY IDENTITY(1,1),
    Fecha DATE,
    FKCodigo_tbl_Ingreso INT,
	Valor_Ingreso float,
    Comprobante_entrega VARCHAR(255),
    Cantidad_GLN DECIMAL(10, 2),
    Mtl_Aeronave VARCHAR(50),
    Pasan DECIMAL(10, 2),
    FOREIGN KEY (FKCodigo_tbl_ingreso) REFERENCES tbl_ingreso (PKCodigo)
);