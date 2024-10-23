import jwt from "jsonwebtoken";
import config from "../config";
import bcrypt from "bcryptjs";
import Role from "../models/Role";
import Client from "../models/Client";
import Admin from "../models/adminOnly";

// Función para manejar el registro de usuarios
const signUpUser = async (req, res, UserModel, defaultRoleName, roleModel) => {
  try {
    const { name, identification, address, contact, email, password } =
      req.body; // Eliminamos roles del destructuring

    if (!name || !email || !password) {
      return res.status(400).json({
        error: `${defaultRoleName} name, email, and password are required.`,
      });
    }

    // Encripta la contraseña
    const encryptedPassword = await UserModel.encryptPassword(password);

    // Crea una nueva instancia del modelo de usuario
    const newUser = new UserModel({
      name,
      identification,
      address,
      contact,
      email,
      password: encryptedPassword,
    });

    // Asigna el rol por defecto según el tipo de usuario
    const role = await roleModel.findOne({ name: defaultRoleName });

    if (!role) {
      return res
        .status(404)
        .json({ error: `Role '${defaultRoleName}' not found` });
    }

    newUser.roles = [role._id]; // Asignamos solo el rol por defecto

    // Guarda el nuevo usuario
    await newUser.save();

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

// Funciones de registro específicas
export const signUpClient = (req, res) =>
  signUpUser(req, res, Client, "client", Role); // Asignamos rol "client" por defecto

export const signUpAdmin = (req, res) =>
  signUpUser(req, res, Admin, "admin", Role); // Asignamos rol "admin" por defecto

// Función para manejar el inicio de sesión de usuarios
export const signInUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Busca al usuario en ambos modelos
    let user =
      (await Client.findOne({ email }).populate("roles")) ||
      (await Admin.findOne({ email }).populate("roles"));

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Verifica la contraseña
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

    // Determina el rol y el nombre del usuario
    const role = user instanceof Admin ? "Admin" : "Client";
    const name = user.name;

    // Genera un token
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

    // Responde con el token y la información del usuario
    res.json({
      token,
      role,
      id: user._id.toString(),
      name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export default {
  signUpClient,
  signUpAdmin,
  signInUsers,
};
