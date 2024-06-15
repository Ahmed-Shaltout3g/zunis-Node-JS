import validator from "validator";
import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minLength: [10, "First Name Must Contain At Least 10 Characters!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  message: {
    type: String,
    required: true,
    minLength: [10, "Message Must Contain At Least 10 Characters!"],
  },
});

const messageToAdminModel = mongoose.model("messageToAdmin", messageSchema);
export default messageToAdminModel;
