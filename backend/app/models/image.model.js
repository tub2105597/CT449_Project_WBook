const mongoose = require('mongoose');

const { imageMessage } = require('../languages');

const imageSchema = mongoose.Schema(
    {
        tenHinh: {
            type: String,
            required: [true, imageMessage.requiredName],
        },
        duLieu: {
            type: Buffer,
            required: [true, imageMessage.requiredData],
        },
    },
);

const Image = mongoose.model('HINHANH', imageSchema);

module.exports = Image;