import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      lowercase: true,
      trim: true,
    },
    caption: String,
    slug: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    Images: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customId: String,
    seen: {
      type: Number,
      default: 0,
    },

    size: [String],
    weight: [String],
  },
  {
    timestamps: true,
  }
);

// productSchema.post("findOneAndUpdate", async function () {
//   const { _id } = this.getQuery();
//   const product = await this.model.findOne({ _id });
//   product.totalVote = product.likes.length - product.unlikes.length;
//   await product.save();
// });

const productModel =
  mongoose.model.Product || mongoose.model("Product", productSchema);

export default productModel;
