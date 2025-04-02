const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/bets', require('./routes/betRoute'));
app.use('/api/wallet', require('./routes/walletRoute'));

// Admin Route
app.use('/api/admin',require('./routes/adminRoutes'))

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
