import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    total: {
      type: Number,
      default: 0
    },
    updated: Date,
    created: {
      type: Date,
      default: Date.now
    }
  });
  
  const Order  = mongoose.model('Order', OrderSchema);

  export default Order;