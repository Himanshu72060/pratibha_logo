const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const connectDB = require("./config/db");
const { initCloudinary } = require('./config/cloudinaryConfig');

const logo = require("./routes/logoRoutes");
const heroRoutes = require('./routes/heroRoutes');
const serviceRoutes = require("./routes/serviceRoutes");
const counterRoutes = require("./routes/counterRoutes");
const partnerRoutes = require('./routes/partnerRoutes');
const recruiterRoutes = require("./routes/recruiterRoutes");
const highlightRoutes = require('./routes/highlightRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const errorHandler = require('./middleware/errorHandler');
const featureCourseRoutes = require('./routes/featureCourseRoutes');



dotenv.config();
const app = express();

// JSON handling middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect DB
connectDB();

// Routes
app.use("/api/logos", logo);
app.use('/api/hero', heroRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/counters", counterRoutes);
app.use('/api/partners', partnerRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use('/api/highlights', highlightRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/v1', coursesRoutes);
app.use('/api/v1/featurecourses', featureCourseRoutes);



app.get('/', (req, res) => res.send('Hero Slider API is running'));

// error handler
app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
