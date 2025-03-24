const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const ApiError = require('./app/utils/error.util');
const { routeMessage } = require('./app/languages')

const authRouter = require('./app/routes/auth.route');
const userRouter = require('./app/routes/user.route');
const imageRouter = require('./app/routes/image.route');
const authorRouter = require('./app/routes/author.route');
const bookRouter = require('./app/routes/book.route');
const categoryRouter = require('./app/routes/category.route');
const publisherRouter = require('./app/routes/publisher.route');
const staffRouter = require('./app/routes/staff.route');
const statusRouter = require('./app/routes/status.route');

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URI,
}));
console.log(`Allow CORS: ${process.env.CLIENT_URI}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use('/uploads', express.static(`${__dirname}/uploads`));

//Routers
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
app.use('/api/author', authorRouter);
app.use('/api/book', bookRouter);
app.use('/api/category', categoryRouter);
app.use('/api/publisher', publisherRouter);
app.use('/api/status', statusRouter);
app.use('/api/staff', staffRouter);

// Undefined Routes
// app.use(('*', (req, res, next) => {
//     return next(new ApiError(routeMessage.notFound.replace('{{originalUrl}}', req.originalUrl), 404));
// }
// ));


//handle Errors


module.exports = app;