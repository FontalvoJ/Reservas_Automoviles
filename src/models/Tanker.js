import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const tankerSchema = new Schema(
  {
    tankername: {
      type: String,
      required: true,
    },
    identification: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    planta: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Tankers",
  }
);

tankerSchema.statics.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

tankerSchema.statics.comparePassword = async function (
  password,
  receivedPassword
) {
  return await bcrypt.compare(password, receivedPassword);
};

export default model("Tankers", tankerSchema);
