const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
    res.send('API is running...');
});

const specRoutes = require('./routes/specRoutes');
const statusRoutes = require('./routes/statusRoutes');

app.use('/api/specs', specRoutes);
app.use('/api/status', statusRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

module.exports = app;
