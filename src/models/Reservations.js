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
    totalDays: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    finalCost: {
      type: Number,
      required: true,
    },
    discountApplied: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      default: 0,
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

const Reservation = mongoose.model("Reservations", reservationSchema);

export default Reservation;
