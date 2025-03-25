const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');
const fs = require('fs').promises;
const path = require('path');

const Book = require('../models/book.model');
const Image = require('../models/image.model');

exports.getBook = catchAsync(async (req, res, next) => {
    const bookQuery = new MongooseQuery(
        Book.findById(req.params.id).populate({
            path: 'maNXB',
            select: '_id tenNXB'
        }).populate({
            path: 'maTG',
            select: '_id tenTG'
        }).populate({
            path: 'maTL',
            select: '_id tenTL'
        }).populate({
            path: 'hinhAnh',
            select: 'duongDan'
        })
    );

    const book = await bookQuery.query;

    if (!book) {
        return next(new ApiError('Không thể tìm được sách cần tìm', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            book
        }
    });
});

exports.getAllBooks = catchAsync(async (req, res, next) => {

    // Tạo điều kiện tìm kiếm nếu có query tên sách
    let filter = {};
    if (req.query.tenSach) {
        filter.tenSach = { $regex: req.query.tenSach, $options: "i" }; // Tìm không phân biệt hoa thường
    }

    const bookQuery = new MongooseQuery(
        Book.find(filter)
            .populate({ path: "maNXB", select: "_id tenNXB" })
            .populate({ path: "maTG", select: "_id tenTG" })
            .populate({ path: "maTL", select: "_id tenTL" })
            .populate({ path: "hinhAnh", select: "duongDan" }),
        { ...req.query }
    );

    const books = await bookQuery.query;

    res.status(200).json({
        status: "success",
        results: books.length,
        data: {
            books,
        },
    });
});



exports.createBook = catchAsync(async (req, res, next) => {
    const payload = { ...req.body };
    payload.images = [];

    const book = await Book.create(payload);

    res.status(201).json({
        status: 'success',
        data: {
            book
        }
    });
});

exports.updateBook = catchAsync(async (req, res, next) => {
    let existingImages = [];
    let newImages = [];

    if (req.body.hinhAnh && req.body.hinhAnh.length > 0) {
        // Lọc ảnh cũ đã có trong DB
        existingImages = await Image.find({ _id: { $in: req.body.hinhAnh.map(img => img._id) } }).select('_id');

        // Lọc ảnh mới chưa có trong DB
        newImages = req.body.hinhAnh.filter(img =>
            !existingImages.some(existing => existing._id.equals(img._id))
            && img.duongDan // Đảm bảo ảnh mới có đường dẫn
        );

        // Lưu ảnh mới vào DB nếu có đầy đủ thông tin
        if (newImages.length > 0) {
            const savedImages = await Image.insertMany(newImages);
            existingImages = [...existingImages, ...savedImages]; // Gộp danh sách ảnh
        }
    }

    // Cập nhật sách với danh sách ảnh đã được xử lý
    const book = await Book.findByIdAndUpdate(
        req.params.id,
        { ...req.body, hinhAnh: existingImages.map(img => img._id) },
        { new: true, runValidators: true }
    );

    if (!book) {
        return next(new ApiError('Không thể tìm được sách cần cập nhật', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { book }
    });
});


exports.deleteBook = catchAsync(async (req, res, next) => {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
        return next(new ApiError('Không thể tìm được sách cần xóa', 404));
    }

    // Kiểm tra nếu sách có hình ảnh
    if (book.hinhAnh && book.hinhAnh.length > 0) {
        await Promise.all(
            book.hinhAnh.map(async (imageID) => {
                const image = await Image.findByIdAndDelete(imageID);
                if (image && image.duongDan) {
                    const imagePath = path.join(__dirname, '..', 'public', image.duongDan);
                    try {
                        await fs.unlink(imagePath); // Xóa file ảnh
                        console.log(`Đã xóa file: ${imagePath}`);
                    } catch (err) {
                        console.error(`Lỗi khi xóa file: ${imagePath}`, err);
                    }
                }
            })
        );
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
