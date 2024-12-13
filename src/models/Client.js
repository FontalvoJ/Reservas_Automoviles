import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";

const clientSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      default: () => new Types.ObjectId(),
    },
    name: {
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
    collection: "Client",
  }
);

clientSchema.statics.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

clientSchema.statics.comparePassword = async function (
  password,
  receivedPassword
) {
  return await bcrypt.compare(password, receivedPassword);
};

export default model("Client", clientSchema);
