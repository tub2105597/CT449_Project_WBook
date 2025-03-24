const mongoose = require('mongoose');

const { publisherMessage } = require('../languages');

const publisherSchema = mongoose.Schema(
    {
        tenNXB: {
            type: String,
            required: [true, publisherMessage.requiredName],
            trim: true,
            minlength: [2, publisherMessage.minLengthName.replace('{{minLength}}', '2')],
        },
        diaChi: {
            type: String,
            required: [true, publisherMessage.requiredAddress],
            trim: true,
            minlength: [10, publisherMessage.minLengthAddress.replace('{{minLength}}', '10')],
        },
        ngayTao: {
            type: Date,
            default: Date.now,
        },
        ngayCapNhat: {
            type: Date,
            default: Date.now,
        },
    }
);

const Publisher = mongoose.model('NHAXUATBAN', publisherSchema);

module.exports = Publisher;
