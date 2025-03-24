const mongoose = require('mongoose');

const { statusMessage } = require('../languages');

const StatusSchema = mongoose.Schema({
    maDG: {
        type: mongoose.Schema.ObjectId,
        ref: 'DOCGIA',
        required: [true, statusMessage.requiredUserID]
    },
    maSach: {
        type: mongoose.Schema.ObjectId,
        ref: 'SACH',
        required: [true, statusMessage.requiredBookID]
    },
    ngayMuon: {
        type: Date,
        default: Date.now,
        required: [true, statusMessage.requiredBorrowingDate]
    },
    ngayTra: {
        type: Date,
        required: [true, statusMessage.requiredReturningDate],
        default: Date.now
    },
    giaHan: {
        type: Boolean,
        default: false
    },
});

const Status = mongoose.model('theodoimuonsach', StatusSchema);

module.exports = Status;