const mongoose = require('mongoose');

const { borrowingRecordMessage } = require('../languages');

const BorrowingRecordSchema = mongoose.Schema({
    maDG: {
        type: mongoose.Schema.ObjectId,
        ref: 'DOCGIA',
        required: [true, borrowingRecordMessage.requiredUserID]
    },
    maSach: {
        type: mongoose.Schema.ObjectId,
        ref: 'SACH',
        required: [true, borrowingRecordMessage.requiredBookID]
    },
    maNV: {
        type: mongoose.Schema.ObjectId,
        ref: 'NHANVIEN',
        required: [true, borrowingRecordMessage.requiredLibrarianID]
    },
    ngayMuon: {
        type: Date,
        default: Date.now,
        required: [true, borrowingRecordMessage.requiredBorrowingDate]
    },
    ngayTra: {
        type: Date,
        required: [true, borrowingRecordMessage.requiredDueDate],
        min: [Date.now, borrowingRecordMessage.minDueDate.replace('{min}', 0)],
        max: [Date.now + 14 * 24 * 60 * 60 * 1000, borrowingRecordMessage.maxDueDate.replace('{max}', 14)]
    },
});