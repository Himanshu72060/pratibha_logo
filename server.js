const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const connectDB = require("./config/db");


const heroRoutes = require('./routes/heroRoutes');
const serviceRoutes = require("./routes/serviceRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// Routes
app.use("/api/logos", require("./routes/logoRoutes"));
app.use('/api/hero', heroRoutes);
app.use("/api/services", serviceRoutes);

app.get('/', (req, res) => res.send('Hero Slider API is running'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
