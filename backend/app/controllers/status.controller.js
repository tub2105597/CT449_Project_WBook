const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Status = require('../models/status.model');
const User = require('../models/user.model');
const Book = require('../models/book.model');

exports.getStatus = catchAsync(async (req, res, next) => {
    const statesQuery = new MongooseQuery(
        Status.findById(req.params.id)
            .populate({
                path: 'maDG',
                select: '_id soDienThoai',

            })
            .populate({
                path: 'maSach',
                select: '_id tenSach soQuyen hinhAnh',
                populate: {  // Populate sâu hơn vào hinhAnh
                    path: 'hinhAnh',
                    select: 'duongDan'
                }
            })
        , { ...req.query }
    );
    const status = await statesQuery.query;

    if (!status) {
        return next(new ApiError('Không tìm thấy thông tin mượn sách với ID này', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            status
        }
    });
});

exports.getAllStatuses = catchAsync(async (req, res, next) => {
    const { tenDG } = req.query;

    console.log(req.params);

    // Tạo điều kiện tìm kiếm nếu có `tenDG`
    const filter = tenDG
        ? {
            $or: [
                { 'maDG.hoLot': { $regex: tenDG, $options: 'i' } },  // Tìm trong hoLot
                { 'maDG.ten': { $regex: tenDG, $options: 'i' } }      // Tìm trong ten
            ]
        }
        : {}; // Nếu không có `tenDG`, không áp dụng bộ lọc

    const statusesQuery = new MongooseQuery(Status.find(filter)
        .populate({
            path: 'maDG',
            select: '_id hoLot ten soDienThoai'
        })
        .populate({
            path: 'maSach',
            select: '_id tenSach donGia hinhAnh',
            populate: {
                path: 'hinhAnh',
                select: '_id duongDan'
            }
        })
    );

    const statuses = await statusesQuery.query;

    res.status(200).json({
        status: 'success',
        data: { statuses }
    });
});



exports.createStatus = catchAsync(async (req, res, next) => {
    // Tìm id của user có trong 
    console.log(req.body);
    const userId = await User
        .findOne({ soDienThoai: req.body.maDG }).select('_id kichHoat');

    if (!userId) {
        console.log(userId);
        return next(new ApiError('Không tìm thấy thông tin người dùng với số điện thoại này', 404));
    }

    if (userId.kichHoat === false) {
        return next(new ApiError('Tài khoản này đã bị khóa', 404));
    }

    const book = await Book.findOne({ _id: req.body.maSach }).select('soQuyen');

    if (book.soQuyen <= 1) {
        return res.status(201).json({
            data: {
                status: 'failed',
                message: 'Sách này đã hết'
            }

        });
    }


    const payload = {
        maDG: userId._id,
        ngayMuon: req.body.ngayMuon,
        ngayTra: req.body.ngayMuon,
        giaHan: req.body.giaHan,
    };

    // Nếu `maSach` là mảng, tạo nhiều `Status`
    if (Array.isArray(req.body.maSach)) {
        const newStatuses = await Status.create(
            req.body.maSach.map(maSach => ({ ...payload, maSach }))
        );

        return res.status(201).json({
            status: 'success',
            data: {
                status: newStatuses
            }
        });
    }

    // Nếu chỉ có một quyển sách
    const newStatus = await Status.create({ ...payload, maSach: req.body.maSach });

    res.status(201).json({
        status: 'success',
        data: {
            status: newStatus
        }
    });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
    const status = await Status.findByIdAndUpdate
        (req.params.id, req.body, {
            new: true,
            runValidators: true
        });

    if (!status) {
        return next(new ApiError('No status found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            status
        }
    });
});

exports.deleteStatus = catchAsync(async (req, res, next) => {
    await Status.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});
