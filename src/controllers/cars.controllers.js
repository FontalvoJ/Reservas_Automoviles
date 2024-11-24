import Car from "../models/Cars";
import Admin from "../models/adminOnly";

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();

    // Si no hay autos, devuelve un mensaje
    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }

    return res.status(200).json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCar = async (req, res) => {
  try {
    const { brand, model, year, color, pricePerDay, location } = req.body;

    // Verificamos si los campos obligatorios están presentes
    if (!brand || !model || !year || !color || !pricePerDay || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verificamos que 'year' y 'pricePerDay' sean números
    if (typeof year !== "number" || typeof pricePerDay !== "number") {
      return res
        .status(400)
        .json({ message: "Year and pricePerDay must be numbers" });
    }

    // Verificamos si el coche ya existe
    const existingCar = await Car.findOne({
      brand,
      model,
      year,
      color,
      location,
    });
    if (existingCar) {
      return res.status(409).json({ message: "A similar car already exists" });
    }

    // Obtener el ID del administrador predeterminado de la base de datos
    const admin = await Admin.findOne(); // Asumimos que 'Admin' es el modelo de administradores
    if (!admin) {
      return res.status(500).json({ message: "No admin found in the system" });
    }

    const createdBy = admin._id; // Asignamos el ID del primer administrador encontrado

    // Creación del nuevo coche con el 'createdBy' del administrador
    const newCar = new Car({
      brand,
      model,
      year,
      color,
      pricePerDay,
      location,
      createdBy, // Asociamos el admin como el creador del coche
    });

    // Guardamos el coche en la base de datos
    const savedCar = await newCar.save();

    return res.status(201).json({
      message: "Car created successfully",
      carId: savedCar._id,
      carDetails: savedCar,
    });
  } catch (error) {
    console.error("Error creating the car:", error);
    return res.status(500).json({ message: "Error creating the car" });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params; // ID del auto a actualizar
    const { brand, model, year, color, pricePerDay, location } = req.body;

    // Validación de campos requeridos
    if (!brand && !model && !year && !color && !pricePerDay && !location) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    // Validación de tipos de datos si se proporcionan
    if (year && typeof year !== "number") {
      return res.status(400).json({ message: "Year must be a number" });
    }
    if (pricePerDay && typeof pricePerDay !== "number") {
      return res
        .status(400)
        .json({ message: "Price per day must be a number" });
    }

    // Busqueda y actualización del auto
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { brand, model, year, color, pricePerDay, location },
      { new: true, omitUndefined: true } // `new: true` devuelve el documento actualizado
    );

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json({
      message: "Car updated successfully",
      carDetails: updatedCar,
    });
  } catch (error) {
    console.error("Error updating the car:", error);
    return res.status(500).json({ message: "Error updating the car" });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    await Car.findByIdAndDelete(id);

    return res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting the car:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCarsByAdmin = async (req, res) => {
  try {
    // Usamos req.userId que proviene del middleware verifyToken
    const adminId = req.userId;

    // Verificamos que el usuario tiene el rol 'admin'
    if (req.role !== "admin") {
      return res.status(403).json({ message: "You don't have permission" });
    }

    // Buscamos los coches asociados al administrador usando adminId
    const cars = await Car.find({ createdBy: adminId });

    // Si no se encuentran coches, devolvemos un mensaje adecuado
    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found for this admin" });
    }

    // Devolvemos los coches encontrados
    return res.status(200).json({
      message: "Cars retrieved successfully",
      cars, // Devolvemos los coches encontrados
    });
  } catch (error) {
    console.error("Error fetching cars by admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
  getCarsByAdmin,
};
