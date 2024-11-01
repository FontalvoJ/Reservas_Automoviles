import jwt from "jsonwebtoken";
import config from "../config";
import AdminOnly from "../models/adminOnly";
import Client from "../models/Client";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) return res.status(403).json({ message: "No token provided" });

    const decoded = jwt.verify(token, config.SECRET);
    console.log("Decoded token:", decoded);

    // Verifica si el token contiene la propiedad `role`
    if (!decoded.role) {
      return res
        .status(400)
        .json({ message: "Token does not contain role information" });
    }

    req.userId = decoded.id;
    req.role = decoded.role; // Asigna el rol a `req.role` para usarlo en el `switch`

    let user;

    // Verifica el rol del usuario y busca el usuario adecuado
    switch (req.role) {
      case "admin":
        user = await AdminOnly.findById(req.userId, { password: 0 });
        if (!user)
          return res.status(404).json({ message: "No admin available" });
        break;
      case "client":
        user = await Client.findById(req.userId, { password: 0 });
        if (!user)
          return res.status(404).json({ message: "No client available" });
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Middleware para validar roles permitidos
export const validateRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (allowedRoles.includes(req.role)) {
        return next();
      } else {
        return res.status(403).json({ message: "You don't have permission" });
      }
    } catch (error) {
      console.error("Error in validateRoles middleware:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

// Exportación del middleware de autenticación
export const authJwt = {
  verifyToken,
};
