const express = require('express');
const cors = require('cors');

const ApiError = require('./app/api.error');

const app = express();

app.use(cors());
app.use(express.json());

//handle 404 errors
app.use((req, res, next) => {
    next(new ApiError(404, 'Resource not found'));
});

//hanlde errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ message: err.message || 'Internal Server Error' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the BACKEND' });
});

module.exports = app;