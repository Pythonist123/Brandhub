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
    categoryID: {
        type: Schema.Types.ObjectId,
        ref:'Category'
    },
    category:{
        type:String,
        
    },
    availableSizes: [{
        type: String,
    }],
    color: [{
        type: String,
    }],
    image:[{
        type:String
    }],
    brandID: {
        type:Schema.Types.ObjectId,
        ref:"Store",
    },
    brand:{
        type:String,
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
