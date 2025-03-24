const ApiError = require('../utils/error.util');
const catchAsync = require('../utils/catchAsync.util');
const { multipleUpload } = require('../utils/upload.util');
const Image = require('../models/image.model'); // Model ảnh

exports.createImage = catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new ApiError(400, 'Không có ảnh nào được tải lên!'));
    }

    // Lưu danh sách đường dẫn ảnh vào MongoDB
    const images = req.files.map(file => ({
        duongDan: `/uploads/${file.filename}`, // Đường dẫn lưu ảnh
    }));

    const savedImages = await Image.insertMany(images); // Lưu vào MongoDB

    res.status(201).json({
        status: 'success',
        message: 'Ảnh đã được tải lên và lưu vào DB',
        data: savedImages,
    });
});
