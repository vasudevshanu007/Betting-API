const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error(error.message);
   
  }
};

module.exports = connectDB;
