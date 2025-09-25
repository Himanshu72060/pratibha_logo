const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const connectDB = require("./config/db");


const heroRoutes = require('./routes/heroRoutes');
const serviceRoutes = require("./routes/serviceRoutes");
const counterRoutes = require("./routes/counterRoutes");
const partnerRoutes = require('./routes/partnerRoutes');
const recruiterRoutes = require("./routes/recruiterRoutes");



dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect DB
connectDB();

// Routes
app.use("/api/logos", require("./routes/logoRoutes"));
app.use('/api/hero', heroRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/counters", counterRoutes);
app.use('/api/partners', partnerRoutes);
app.use("/api/recruiters", recruiterRoutes);



app.get('/', (req, res) => res.send('Hero Slider API is running'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
