import express from "express";
import morgan from "morgan";
import cors from "cors";
import pkg from "../package.json";
import authRoutes from "./routes/auth.routes";

import { createRoles } from "./libs/initialSetup";

// Inicializamos la aplicación express
const app = express();

// Llamamos a la función createRoles
createRoles();

// Configuramos el middleware de logging con Morgan
app.use(morgan("dev"));
app.use(express.json());

// Configuramos el middleware de CORS
const allowedOrigins = ["http://localhost:4200"];
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir solicitudes de origen no especificado (como solicitudes internas)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Definimos una ruta principal que devuelve la información del paquete
app.get("/", (req, res) => {
  const packageInfo = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
  };
  res.json(packageInfo);
});

app.use("/api/auth", authRoutes);



export default app;
