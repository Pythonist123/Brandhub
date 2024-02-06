import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'store' }, // Set default value to 'store'
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

const Store = mongoose.model('Store', storeSchema);

export default Store;
