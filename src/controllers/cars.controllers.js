import Car from "../models/Cars";

export const createCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      color,
      pricePerDay,
      location,
      power,
      system,
      accompanists,
    } = req.body;

    // Validación de campos requeridos
    if (
      !brand ||
      !model ||
      !year ||
      !color ||
      !pricePerDay ||
      !location ||
      !power ||
      !system ||
      !accompanists
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validaciones adicionales
    if (typeof year !== "number" || typeof pricePerDay !== "number") {
      return res
        .status(400)
        .json({ message: "Year and pricePerDay must be numbers" });
    }

    if (year < 1886 || year > new Date().getFullYear()) {
      return res.status(400).json({ message: "Invalid year" });
    }

    if (pricePerDay <= 0) {
      return res
        .status(400)
        .json({ message: "Price per day must be positive" });
    }

    if (![2, 4, 5, 7].includes(accompanists)) {
      return res
        .status(400)
        .json({ message: "Accompanists must be one of: 2, 4, 5, 7" });
    }

    // Verificar si ya existe un coche similar
    const existingCar = await Car.findOne({
      brand,
      model,
      year,
      color,
      location,
      power,
      system,
      accompanists,
    });
    if (existingCar) {
      return res.status(409).json({ message: "A similar car already exists" });
    }

    // Set createdBy field from req.userId
    const createdBy = req.userId;

    // Crear el nuevo coche
    const newCar = new Car({
      brand,
      model,
      year,
      color,
      pricePerDay,
      location,
      createdBy,
      power,
      system,
      accompanists,
    });

    // Guardar el coche en la base de datos
    const savedCar = await newCar.save();

    return res.status(201).json({
      message: "Car created successfully",
      carId: savedCar._id,
      carDetails: savedCar,
    });
  } catch (error) {
    console.error("Error creating the car:", error);
    if (error.name === "ValidationError") {
      // Si es un error de validación de Mongoose
      return res.status(400).json({ message: error.message });
    }
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
    if (error.name === "CastError" && error.kind === "ObjectId") {
      // Si el error es de tipo 'CastError' debido a un ID malformado
      return res.status(400).json({ message: "Invalid car ID format" });
    }
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
    const adminId = req.userId;

    if (req.role !== "admin") {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const cars = await Car.find({ createdBy: adminId });

    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found for this admin" });
    }

    return res.status(200).json({
      message: "Cars retrieved successfully",
      cars,
    });
  } catch (error) {
    console.error("Error fetching cars by admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controlador para listar coches para todos los usuarios (sin autenticación)
export const getAllCarsForEveryone = async (req, res) => {
  try {
    const cars = await Car.find();

    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }

    return res.status(200).json({
      message: "Cars retrieved successfully",
      cars,
    });
  } catch (error) {
    console.error("Error fetching all cars:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controlador para listar coches solo para usuarios autenticados
export const getCarsForAuthenticatedUsers = async (req, res) => {
  try {
    const cars = await Car.find();

    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }

    return res.status(200).json({
      message: "Cars retrieved successfully",
      cars,
    });
  } catch (error) {
    console.error("Error fetching cars for authenticated user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createCar,
  updateCar,
  deleteCar,
  getCarsByAdmin,
  getAllCarsForEveryone,
  getCarsForAuthenticatedUsers,
};
