import mongoose from "mongoose";

import { Schema } from "mongoose";

// Cart Item Schema
const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  purchasePrice: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  priceWithTax: {
    type: Number,
    default: 0
  },
  totalTax: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: "Not_processed",
    enum: [
      "Not_processed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ]
  }
});

export const CartItem = mongoose.model('CartItem', CartItemSchema);

// Cart Schema
const CartSchema = new Schema({
  products: [CartItemSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

export const Cart = mongoose.model('Cart', CartSchema);

