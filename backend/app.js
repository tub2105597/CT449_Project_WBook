const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const ApiError = require('./app/utils/error.util');
const { routeMessage } = require('./app/languages')

const authRouter = require('./app/routes/auth.route');
const userRouter = require('./app/routes/user.route');

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URI,
}));
console.log(`Allow CORS: ${process.env.CLIENT_URI}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

//Routers
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Undefined Routes
app.use(('*', (req, res, next) => {
    return next(new ApiError(routeMessage.notFound.replace('{{originalUrl}}', req.originalUrl), 404));
}
));


//handle Errors


module.exports = app;