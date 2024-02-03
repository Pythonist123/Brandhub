// db.js
import mongoose from 'mongoose';
import "dotenv/config"
const uri = process.env.CONNECTION_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectToDatabase;
