import mongoose, { Schema, Types } from "mongoose";

const carSchema = new Schema(
  {
    carId: {
      type: Schema.Types.ObjectId,
      required: true,
      default: () => new Types.ObjectId(),
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1886,
      max: new Date().getFullYear(),
    },
    color: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: [0, "Price per day must be positive"],
    },
    location: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
      required: true,
    },
    power: {
      type: Number,
      required: true,
      min: [0, "Power must be a positive number"],
    },
    system: {
      type: String,
      required: true,
      enum: ["Gasolina", "Diesel", "Electrónico", "Híbrido"],
      message: "System must be one of: Gasolina, Diesel, Electrónico, Híbrido",
    },
    accompanists: {
      type: Number,
      required: true,
      enum: [2, 4, 5, 7],
      message: "Accompanists must be one of: 2, 4, 5, 7",
    },
    image: {
      
      type: String,
      required: true, 
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Cars",
  }
);

const Cars = mongoose.model("Cars", carSchema);

export default Cars;
