// models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Add any other fields you may need for your user model
  // For example, name, profile picture, etc.
});

const User = mongoose.model('User', userSchema);

export default User;
