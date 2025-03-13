const mongoose = require('mongoose');

const { bookMessage } = require('../languages');

const bookSchema = mongoose.Schema(
    {
        maSach: {
            type: String,
            required: [true, bookMessage.requiredCode],
            unique: true,
            trim: true,
        },
        tenSach: {
            type: String,
            required: [true, bookMessage.requiredName],
            trim: true,
            minlength: [2, bookMessage.minLengthName.replace('{{minLength}}', '2')],
        },
        donGia: {
            type: Number,
            required: [true, bookMessage.requiredPrice],
            min: [0, bookMessage.minPrice.replace('{{min}}', '0')],
        },
        soQuyen: {
            type: Number,
            required: [true, bookMessage.requiredQuantity],
            min: [0, bookMessage.minQuantity.replace('{{min}}', '0')],
        },
        namXuatBan: {
            type: Number,
            required: [true, bookMessage.requiredYear],
            min: [1900, bookMessage.minYear.replace('{{min}}', '1900')],
            max: [new Date().getFullYear(), bookMessage.maxYear.replace('{{max}}', new Date().getFullYear())],
        },
        maNXB: {
            type: mongoose.Schema.ObjectId,
            required: [true, bookMessage.requiredPublisher],
            ref: 'NHAXUATBAN',
        },
        maTG: {
            type: [{ type: mongoose.Schema.ObjectId, ref: 'TACGIA' }],
        },
        maTL: {
            type: [{ type: mongoose.Schema.ObjectId, ref: 'THELOAI' }],
            required: [true, bookMessage.requiredCategory],
        },
        moTa: {
            type: String,
            required: [true, bookMessage.requiredDescription],
            trim: true,
            minlength: [10, bookMessage.minLengthDescription.replace('{{minLength}}', '10')],
        },
        hinhAnh: {
            type: [{ type: mongoose.Schema.ObjectId, ref: 'HINHANH' }],
        },
        ngayTao: {
            type: Date,
            default: Date.now,
        },
        ngayCapNhat: {
            type: Date,
            default: Date.now,
        },
        nguoiTao: {
            type: mongoose.Schema.ObjectId,
            required: [true, bookMessage.requiredCreator],
            ref: 'NHANVIEN',
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
    }
);

const Book = mongoose.model('SACH', bookSchema);

module.exports = Book;