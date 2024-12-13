import Reservation from "../models/Reservations";
import Cars from "../models/Cars";
import Clients from "../models/Client";

export const createReservation = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    // Verificar que el auto exista en la base de datos
    const car = await Cars.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Verificar que las fechas sean válidas y que endDate sea posterior a startDate
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      return res
        .status(400)
        .json({ message: "Invalid start date or end date" });
    }

    // Obtener el clientId del token
    const clientId = req.userId; // Assumed to be decoded from the token

    // Verificar que el cliente exista en la base de datos
    const client = await Clients.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Crear la nueva reserva utilizando el clientId del token
    const reservation = new Reservation({
      carId: carId, // ID correcto del auto
      clientId: clientId, // ID del cliente extraído del token
      startDate,
      endDate,
      carBrand: car.brand, 
      carModel: car.model, 
      clientName: client.name,
      totalCost: calculateTotalCost(car.pricePerDay, startDate, endDate),
    });

    // Guardar la reserva en la base de datos
    await reservation.save();

    return res.status(201).json(reservation);
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para calcular el costo total basado en las fechas
const calculateTotalCost = (pricePerDay, startDate, endDate) => {
  const days =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
  return days * pricePerDay;
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status } = req.body;

    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = status;
    const updatedReservation = await reservation.save();

    return res.status(200).json({
      message: "Reservation status updated successfully",
      updatedReservation,
    });
  } catch (error) {
    console.error("Error updating reservation status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const reservations = await Reservation.find()
      .populate("carId", "brand model year")
      .populate("clientId", "name email");

    return res.status(200).json({
      message: "Reservations retrieved successfully",
      reservations,
    });
  } catch (error) {
    console.error("Error retrieving reservations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await Reservation.findByIdAndDelete(reservationId);

    return res
      .status(200)
      .json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getUserActiveReservations = async (req, res) => {
  try {
    // Verificar que el usuario tenga el rol de 'client'
    if (req.role !== "client") {
      return res.status(403).json({ message: "Access denied. Clients only." });
    }

    const clientId = req.userId;

    // Obtener las reservas del cliente
    const reservations = await Reservation.find({ clientId })
      .populate("carId", "brand model") // Popula solo las referencias que necesitamos
      .exec();

    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ message: "No reservations found for this client" });
    }

    // Formatear las reservas para incluir solo los datos necesarios
    const formattedReservations = reservations.map((reservation) => {
      const days =
        (new Date(reservation.endDate) - new Date(reservation.startDate)) /
        (1000 * 60 * 60 * 24);
      return {
        idCar: reservation.carId._id,
        brand: reservation.carId.brand,
        model: reservation.carId.model,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        totalDays: days,
        totalCost: reservation.totalCost,
        status: reservation.status,
      };
    });

    return res.status(200).json({
      message: "Reservations retrieved successfully",
      reservations: formattedReservations,
    });
  } catch (error) {
    console.error("Error retrieving user reservations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default {
  createReservation,
  updateReservationStatus,
  getAllReservations,
  deleteReservation,
  getUserActiveReservations,
};
