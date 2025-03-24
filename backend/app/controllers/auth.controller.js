const jwt = require('jsonwebtoken');

const ApiError = require('../utils/error.util');
const catchAsync = require('../utils/catchAsync.util');
const { filterPayload } = require('../utils/extract.util');

const { authMessage } = require('../languages');

const User = require('../models/user.model');
const Staff = require('../models/staff.model');

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);

    user.kichHoat = true;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
        status: 'success',
        message: authMessage.signupSuccess,
    });
});

exports.loginUser = catchAsync(async (req, res, next) => {
    const { soDienThoai, matKhau } = req.body;

    if (!soDienThoai || !matKhau) {
        return next(new ApiError(authMessage.emptyLoginInfo, 400));
    }

    const user
        = await User.findOne({ soDienThoai: soDienThoai }).select('+matKhau');

    if (!user || !(await user.comparePassword(matKhau, user.matKhau))) {
        return next(new ApiError(authMessage.LogInFailed, 401));
    }

    res.status(200).json({
        status: 'success',
        message: authMessage.LogInSuccess,
        data: {
            soDienThoai: user.soDienThoai,
            vaiTro: user.vaiTro,
        },
    });
});

exports.loginStaff = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const { maNV, matKhau } = req.body;

    if (!maNV || !matKhau) {
        return next(new ApiError(authMessage.emptyLoginInfo, 400));
    }

    const staff = await Staff.findOne
        ({ maNV: maNV }).select('+matKhau');

    if (!staff || !(await staff.comparePassword(matKhau, staff.matKhau))) {
        return next(new ApiError(authMessage.LogInFailed, 401));
    }

    res.status(200).json({
        status: 'success',
        message: authMessage.LogInSuccess,
        data: {
            maNV: staff.maNV,
            vaiTro: staff.vaiTro,
        },
    });
});