import mongoose, { Schema } from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL'],
    },
    color: [{
        type: String,
    }],
    brand: {
        type:Schema.Types.ObjectId,
        ref:"store",
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
