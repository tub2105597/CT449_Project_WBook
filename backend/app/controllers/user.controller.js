const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const { filterPayload } = require('../utils/extract.util');
const catchAsync = require('../utils/catchAsync.util');
const { userMessage } = require('../languages');
const mongoose = require('mongoose');


const User = require('../models/user.model');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(User.find(), { ...req.query });
    // mongooseQuery.filter().sort().paginate();

    const users = await mongooseQuery.query.select('-matKhau -xacNhanMatKhau');

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users },
    });
});

exports.getUser = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.params.id).select('-matKhau -xacNhanMatKhau');

    if (!user) {
        return next(new ApiError(userMessage.notFound, 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    console.log('req.body: ', req.body);
    const user = await User.create(req.body).select('-matKhau');
    console.log('user: ', user);
    res.status(201).json({
        status: 'success',
        data: { user },
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, { ...req.body }, {
        new: true,
        runValidators: true,
    }).select('-matKhau -xacNhanMatKhau');

    if (!user) {
        return next(new ApiError(userMessage.notFound, 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new ApiError(userMessage.notFound, 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    const filtered = filterPayload(req.body, ['matKhau', 'xacNhanMatKhau']);

    const user = await User.findByIdAndUpdate(req.user.id, filtered, {
        new: true,
        runValidators: true,
    }).select('-password -xacNhanMatKhau');

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    //unactive user
    await User.findByIdAndUpdate(req.user.id, { kichHoat: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});