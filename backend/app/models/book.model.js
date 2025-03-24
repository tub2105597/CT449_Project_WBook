const mongoose = require('mongoose');

const { bookMessage } = require('../languages');

const bookSchema = mongoose.Schema(
    {
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
            min: [1, bookMessage.minQuantity.replace('{{min}}', '1')],
        },
        namXuatBan: {
            type: Number,
            required: [true, bookMessage.requiredYear],
            min: [1900, bookMessage.minYear.replace('{{min}}', '1900')],
            max: [new Date().getFullYear(), bookMessage.maxYear.replace('{{max}}', new Date().getFullYear())],
        },
        maNXB: {
            type: mongoose.Schema.ObjectId,
            ref: 'NHAXUATBAN',
            required: [true, bookMessage.requiredPublisher],
        },
        maTG: {
            type: mongoose.Schema.ObjectId,
            ref: 'TACGIA',
            required: [true, bookMessage.requiredAuthor],
        },
        maTL: {
            type: mongoose.Schema.ObjectId,
            ref: 'THELOAI',
            required: [true, bookMessage.requiredCategory],
        },
        moTa: {
            type: String,
            required: [true, bookMessage.requiredDescription],
            trim: true,
        },
        hinhAnh: {
            type: [{ type: mongoose.Schema.ObjectId, ref: 'HINHANH' }],
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