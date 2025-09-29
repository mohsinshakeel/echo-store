import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      min: 0,
    },
    image_url: {
      type: String,
      required: true,
      trim: true,
    },
    image_filename: {
      type: String,
      trim: true,
    },
    image_mimetype: {
      type: String,
      trim: true,
    },
    image_size: {
      type: Number,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
