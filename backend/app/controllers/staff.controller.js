const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const { filterPayload } = require('../utils/extract.util');
const catchAsync = require('../utils/catchAsync.util');
const { staffMessage } = require('../languages');

const Staff = require('../models/staff.model');

exports.getAllStaffs = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(Staff.find(), { ...req.query });

    const staffs = await mongooseQuery.query;

    res.status(200).json({
        status: 'success',
        data: { staffs },
    });
});

exports.createStaff = catchAsync(async (req, res, next) => {
    const staff = await Staff.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { staff },
    });
});

exports.updateStaff = catchAsync(async (req, res, next) => {
    const staff = await Staff.findByIdAndUpdate(req.staff.id, { ...req.body }, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: { staff },
    });
});

exports.deleteStaff = catchAsync(async (req, res, next) => {
    await Staff.findByIdAndDelete(req.staff.id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
