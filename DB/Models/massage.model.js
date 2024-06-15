import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    body: { type: String, required: true },
    sentTo: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("message", messageSchema);
export default messageModel;
