const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const { filterPayload } = require('../utils/extract.util');
const catchAsync = require('../utils/catchAsync.util');
const { staffMessage } = require('../languages');
const bcrypt = require('bcrypt');

const Staff = require('../models/staff.model');

exports.getAllStaffs = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(Staff.find({ vaiTro: 'nhanVien' }), req.query);

    const staffs = await mongooseQuery.query;

    res.status(200).json({
        status: 'success',
        data: { staffs },
    });
});

exports.getStaff = catchAsync(async (req, res, next) => {
    const staff = await Staff.findById(req.params.id).select('-matKhau');

    if (!staff) {
        return next(new ApiError(staffMessage.notFound, 404));
    }

    res.status(200).json({
        status: 'success',
        data: { staff },
    });
});

exports.createStaff = catchAsync(async (req, res, next) => {
    req.body.vaiTro = 'nhanVien';
    req.body.matKhau = await bcrypt.hash(req.body.matKhau, 10);

    const staff = await Staff.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { staff },
    });
});

exports.updateStaff = catchAsync(async (req, res, next) => {
    const newPassword = req.body.matKhau ?
        await bcrypt.hash(req.body.matKhau, 10) : undefined;

    req.body.matKhau = newPassword;

    const staff = await Staff.findByIdAndUpdate(req.params.id, { ...req.body }, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: { staff },
    });
});

exports.deleteStaff = catchAsync(async (req, res, next) => {
    await Staff.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
