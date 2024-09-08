import jwt from "jsonwebtoken";
import config from "../config";
const bcrypt = require("bcryptjs");
import Role from "../models/Role";
import Tanker from "../models/Tanker";
import Admin from "../models/adminOnly";

/// Función genérica para registrar usuarios
const signUpUser = async (req, res, UserModel, defaultRoleName, roleModel) => {
  try {
    const {
      name,
      tankername,
      identification,
      address,
      planta,
      contact,
      email,
      password,
      roles,
    } = req.body;

    // Determina el nombre del usuario basado en el tipo de usuario
    const username = name || tankername;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: `${defaultRoleName} name, email, and password are required.` });
    }

    // Encripta la contraseña
    const encryptedPassword = await UserModel.encryptPassword(password);

    // Crea una nueva instancia del modelo de usuario
    const newUser = new UserModel({
      name: username,
      identification,
      address,
      planta,
      contact,
      email,
      password: encryptedPassword,
    });

    // Asigna roles
    if (roles && roles.length > 0) {
      const foundRoles = await roleModel.find({ name: { $in: roles } });

      if (foundRoles.length === 0) {
        return res.status(404).json({ error: "No roles found" });
      }

      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await roleModel.findOne({ name: defaultRoleName });

      if (!role) {
        return res.status(404).json({ error: `Role '${defaultRoleName}' not found` });
      }

      newUser.roles = [role._id];
    }

    // Guarda el nuevo usuario
    const savedUser = await newUser.save();

    res.status(201).json({
      message: `Create ${defaultRoleName} Success`,
    });
  } catch (error) {
    console.error(`Error in ${defaultRoleName} registration:`, error.message);
    res.status(500).json({
      error: `Error in ${defaultRoleName} registration`,
    });
  }
};

// Uso de la función genérica para diferentes tipos de usuario
export const signUpTanker = (req, res) => signUpUser(req, res, Tanker, "Tanker", Role);

export const signUpAdmin = (req, res) => signUpUser(req, res, Admin, "Admin", Role);


export const signInUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    let user =
      (await Tanker.findOne({ email }).populate("roles")) ||
      (await Admin.findOne({ email }).populate("roles"));

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({
        token: null,
        message: "Invalid password",
      });
    }

    if (!user.roles || user.roles.length === 0) {
      return res.status(400).json({
        message: "User roles not found",
      });
    }

    let role = null;
    let name = "";

    if (user instanceof Admin) {
      role = "Admin";
      name = user.institutionName;
    } else if (user instanceof Tanker) {
      role = "Tanker";
      name = user.name;
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: role,
      },
      config.SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      token,
      role,
      id: user._id.toString(),
      name: name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default {
  signUpTanker,
  signUpAdmin,
  signInUsers,
};
