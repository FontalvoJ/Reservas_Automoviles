import jwt from "jsonwebtoken";
import config from "../config";
import AdminOnly from "../models/adminOnly";
import Client from "../models/Client";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.SECRET);
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!decoded.role) {
      return res
        .status(400)
        .json({ message: "Token does not contain role information" });
    }

    req.userId = decoded.id;
    req.role = decoded.role;

    let user;
    switch (req.role) {
      case "admin":
        user = await AdminOnly.findById(req.userId, { password: 0 });
        if (!user) {
          return res.status(404).json({ message: "Admin not found" });
        }
        break;
      case "client":
        user = await Client.findById(req.userId, { password: 0 });
        if (!user) {
          return res.status(404).json({ message: "Client not found" });
        }
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const validateRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.role) {
        return res.status(403).json({ message: "Role information missing" });
      }

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

export const authJwt = {
  verifyToken,
};
