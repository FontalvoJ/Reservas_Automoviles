import jwt from "jsonwebtoken";
import config from "../config";
const bcrypt = require("bcryptjs");
import Role from "../models/Role";
import Tanker from "../models/Tanker";
import Admin from "../models/adminOnly";

export const signUpTanker = async (req, res) => {
  try {
    const {
      tankername,
      identification,
      address,
      planta,
      contact,
      email,
      password,
      roles,
    } = req.body;

    if (!tankername || !email || !password) {
      return res
        .status(400)
        .json({ error: "Tanker name, email, and password are required." });
    }

    const encryptedPassword = await Tanker.encryptPassword(password);

    const newTanker = new Tanker({
      tankername,
      identification,
      address,
      planta,
      contact,
      email,
      password: encryptedPassword,
    });

    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } });

      if (foundRoles.length === 0) {
        return res.status(404).json({ error: "No roles found" });
      }

      newTanker.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "Tanker" });

      if (!role) {
        return res.status(404).json({ error: "Role 'Tanker' not found" });
      }

      newTanker.roles = [role._id];
    }

    const savedTanker = await newTanker.save();

    res.status(201).json({
      message: "Create Tanker Success",
    });
  } catch (error) {
    console.error("Error in tanker registration:", error.message);
    res.status(500).json({
      error: "Error in tanker registration",
    });
  }
};

export const signUpAdmin = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const encryptedPassword = await Admin.encryptPassword(password);

    const newAdmin = new Admin({
      name,
      email,
      password: encryptedPassword,
    });

    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } });

      if (foundRoles.length === 0) {
        return res.status(404).json({ error: "No roles found" });
      }

      newAdmin.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "Admin" });

      if (!role) {
        return res.status(404).json({ error: "Role 'Admin' not found" });
      }

      newAdmin.roles = [role._id];
    }

    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      message: "Create Admin Success",
    });
  } catch (error) {
    console.error("Error in admin registration:", error.message);
    res.status(500).json({
      error: "Error in admin registration",
    });
  }
};

export default {
  signUpTanker,
  signUpAdmin,
};
