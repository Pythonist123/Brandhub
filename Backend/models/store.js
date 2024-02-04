// models/store.js
import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    // Define your store schema fields here
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // ... other fields
});

const Store = mongoose.model('Store', storeSchema);

export default Store;
