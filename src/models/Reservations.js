import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cars",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Reservations",
  }
);

// Verificación pre-save para calcular el totalCost
reservationSchema.pre("save", async function (next) {
  try {
    // Verificar que el coche exista en la base de datos
    const car = await mongoose.model("Cars").findById(this.carId);
    if (!car) throw new Error("Car not found");

    // Calcular el totalCost basado en las fechas de la reserva
    const days = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
    this.totalCost = days * car.pricePerDay;
    next();
  } catch (error) {
    next(error);
  }
});

const Reservation = mongoose.model("Reservations", reservationSchema);

export default Reservation;
