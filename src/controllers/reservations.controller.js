import Reservation from "../models/Reservations";
import Cars from "../models/Cars";
import Clients from "../models/Client";

export const createReservation = async (req, res) => {
  try {
    const { carId, startDate, endDate, totalCost: clientTotalCost } = req.body;

    if (!startDate || !endDate || new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json({ message: "Invalid start date or end date" });
    }

    const car = await Cars.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const clientId = req.userId;
    const client = await Clients.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const overlappingReservation = await Reservation.findOne({
      carId,
      status: { $ne: "completed" },
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    });

    if (overlappingReservation) {
      return res.status(400).json({
        message: "This car is already reserved for the selected dates.",
      });
    }

    // Cálculo del precio en el backend
    const totalDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );

    let discountPercentage = 0;
    if (totalDays > 20) discountPercentage = 20;
    else if (totalDays > 12) discountPercentage = 10;

    const totalCost = totalDays * car.pricePerDay;
    const discountApplied = discountPercentage > 0;
    const finalCost = totalCost - (totalCost * discountPercentage) / 100;

    // Verificar si hay inconsistencias con el cálculo del frontend
    if (clientTotalCost && clientTotalCost !== finalCost) {
      console.warn("Client total cost does not match backend calculation!");
    }

    const reservation = new Reservation({
      carId,
      clientId,
      startDate,
      endDate,
      carBrand: car.brand,
      carModel: car.model,
      clientName: client.name,
      totalDays,
      totalCost,
      finalCost,
      discountApplied,
      discountPercentage,
      status: "pending",
    });

    await reservation.save();

    return res.status(201).json({
      reservation,
      message: discountApplied
        ? `Reservation created with a ${discountPercentage}% discount!`
        : "Reservation created successfully.",
    });
  } catch (error) {
    console.error("Error creating the reservation:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status } = req.body;

    // Check if the user has the role of admin
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Check if the reservation ID exists
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Validate the provided status
    const validStatuses = ["pending", "active", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid reservation status" });
    }

    // Update the reservation status
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

export const listAllReservations = async (req, res) => {
  try {
    // Verificar que el usuario tenga el rol de 'admin'
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Obtener todas las reservas
    const reservations = await Reservation.find()
      .populate("carId", "brand model")
      .populate("clientId", "name")
      .exec();

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found." });
    }

    // Formatear las reservas para incluir los detalles requeridos
    const formattedReservations = reservations.map((reservation) => {
      const days =
        (new Date(reservation.endDate) - new Date(reservation.startDate)) /
        (1000 * 60 * 60 * 24);

      return {
        idReservation: reservation._id,
        idCar: reservation.carId._id,
        brand: reservation.carId.brand,
        model: reservation.carId.model,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        totalDays: days,
        finalCost,
        discountApplied,
        discountPercentage,
        status: reservation.status,
        idClient: reservation.clientId._id,
        clientName: reservation.clientId.name,
        createdAt: reservation.createdAt,
      };
    });

    return res.status(200).json({
      message: "Reservations retrieved successfully",
      reservations: formattedReservations,
    });
  } catch (error) {
    console.error("Error retrieving all reservations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createReservation,
  updateReservationStatus,
  deleteReservation,
  getUserActiveReservations,
};
