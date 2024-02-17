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
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customId: String,

    // ========================new==================
    section: {
      type: String,
      required: true,
      enum: ["rent", "sale"],
    },
    rentDeatils: {
      priceInDay: Number,
      priceInMonth: Number,
      priceInYear: Number,
      desc: String,
    },
    propertyDesc: {
      size: Number,
      view: String,
      bedrooms: Number,
      bathrooms: Number,
      finishingType: {
        type: String,
        enum: ["super lux", "lux", "without finished", "Garden", "other"],
      },
      yearOfConstruction: Number,
      shahrAqary: {
        type: String,
        enum: ["registered", "eligible", "not sure"],
      },
      floor: Number,
    },
    PaymentMethod: {
      type: String,
      enum: ["cash", "installments", "both"],
    },
    status: { type: String, enum: ["available", "sold"], default: "available" },
    location: {
      type: String,
      required: true,
    },
    descLocation: {
      type: String,
      required: true,
    },
    youtubeURL: {
      type: String,
    },
    isAccepted: { type: Boolean, default: false },
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
