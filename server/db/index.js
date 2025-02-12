import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`,
      {
        dbName: process.env.DB_NAME,
      }
    );
    console.log(
      `\nMONGODB connected at host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB Connection FAILED!", error);
  }
};

export default connectDB;
