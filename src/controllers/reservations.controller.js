import Reservation from "../models/Reservations";
import Car from "../models/Cars";
import Client from "../models/Client";

export const createReservation = async (req, res) => {
  try {
    // Destructuring los datos del cuerpo de la solicitud
    const { carId, clientId, startDate, endDate } = req.body;

    // Verificar que el auto y el cliente existan
    const car = await Car.findById(carId);
    const client = await Client.findById(clientId);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Calcular el total cost de la reserva
    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    const totalCost = days * car.pricePerDay;

    // Crear la nueva reserva directamente usando los IDs generados por MongoDB
    const reservation = new Reservation({
      car: carId, // Se usa el ID del auto directamente
      client: clientId, // Se usa el ID del cliente directamente
      startDate,
      endDate,
      totalCost,
    });

    await reservation.save();

    return res.status(201).json(reservation);
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
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
    if (req.role !== "client") {
      return res.status(403).json({ message: "Access denied. Clients only." });
    }

    const userId = req.userId;

    const activeReservations = await Reservation.find({
      client: userId,
      status: { $in: ["pending", "active", "completed", "cancelled"] },
    })
      .populate("car", "brand model year")
      .select("-client");

    return res.status(200).json({
      message: "Active reservations retrieved successfully",
      reservations: activeReservations,
    });
  } catch (error) {
    console.error("Error retrieving active reservations:", error);
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
