const jwt = require('jsonwebtoken');

const ApiError = require('../utils/error.util');
const catchAsync = require('../utils/catchAsync.util');
const { filterPayload } = require('../utils/extract.util');
const { setCookie, getCookie, clearCookie } = require('../utils/cookie.util');

const { authMessage } = require('../languages');

const User = require('../models/user.model');

const signToken = _id => {
    return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);

    user.kichHoat = true;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
        status: 'success',
        message: authMessage.signupSuccess,
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { soDienThoai, matKhau } = req.body;

    if (!soDienThoai || !matKhau) {
        return next(new ApiError(authMessage.emptyLoginInfo, 400));
    }

    const user
        = await User.findOne({ soDienThoai }).select('+matKhau');

    if (!user || !(await user.comparePassword(matKhau, user.matKhau))) {
        return next(new ApiError(authMessage.LogInFailed, 401));
    }

    setCookie(res, signToken(user._id));

    res.status(200).json({
        status: 'success',
        message: authMessage.LogInSuccess,
        data: {
            soDienThoai: user.soDienThoai
        },
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    const decodedToken = jwt.verify(getCookie(req), process.env.JWT_SECRET_KEY)

    const user = await User.findById(decodedToken._id);

    if (!user) {
        return next(new ApiError(authMessage.userNotFound, 404));
    }

    req.user = {
        id: user._id,
        soDienThoai: user.soDienThoai
    };

    next();
});

exports.logout = catchAsync(async (req, res, next) => {
    await clearCookie(res);

    res.status(200).json({
        status: 'success',
        message: authMessage.LogOutSuccess,
    });
});