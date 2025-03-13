const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const { filterPayload } = require('../utils/extract.util');
const catchAsync = require('../utils/catchAsync.util');
const { userMessage } = require('../languages');

const User = require('../models/user.model');

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