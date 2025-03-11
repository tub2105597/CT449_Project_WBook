const express = require('express');
const cors = require('cors');

const ApiError = require('./app/api-error');

const app = express();
const BooksRouter = require('./app/routes/book.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/books', BooksRouter);

//handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, 'Resource not Found'));
});

//handle errors
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to contact book application.' });
});

module.exports = app;