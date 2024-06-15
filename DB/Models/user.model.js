import mongoose, { Schema } from "mongoose";
import { hashingPassword } from "../../src/utils/hashing.js";
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      uniqe: true,
    },
    password: {
      type: String,
    },

    role: {
      type: String,
      default: systemRoles.USER,
    },
    // =======================new field====================
    phoneNumber: {
      type: String,
      required: true,
    },
    typeOfUser: {
      type: String,
      required: true,
      enum: ["owner of real estate", "marketing company", "other"],
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next, doc) {
  this.password = hashingPassword(
    this.password,
    parseInt(process.env.SOLT_ROUNDS)
  );
  next();
});
const userModel = mongoose.model.User || mongoose.model("User", userSchema);

export default userModel;
