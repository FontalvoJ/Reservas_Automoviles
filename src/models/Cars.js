const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Cars",
  }
);

const Cars = mongoose.model("Cars", carSchema);

module.exports = Cars;
