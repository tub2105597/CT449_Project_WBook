const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const ApiError = require('./app/utils/error.util');

const app = express();

//middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
console.log(`Allowed Origins: ${process.env.CLIENT_URL}`);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

//handle 404 errors
// app.use((req, res, next) => {
//     next(new ApiError(404, 'Resource not found'));
// });

//hanlde errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ message: err.message || 'Internal Server Error' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the BACKEND' });
});

module.exports = app;