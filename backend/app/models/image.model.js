const mongoose = require('mongoose');

const { imageMessage } = require('../languages');

const imageSchema = mongoose.Schema(
    {
        duongDan: {
            type: String,
            required: [true, 'Đường dẫn không được để trống'],
        }
    },
);

const Image = mongoose.model('HINHANH', imageSchema);

module.exports = Image;