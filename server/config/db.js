import mongoose from 'mongoose';

/**
 * Establish a single shared connection to MongoDB.
 * Exits the process on failure so orchestrators can restart cleanly.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌  MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
