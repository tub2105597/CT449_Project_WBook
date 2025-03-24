const mongoose = require('mongoose');

const { categoryMessage } = require('../languages');

const categorySchema = mongoose.Schema(
    {
        tenTL: {
            type: String,
            required: [true, categoryMessage.requiredName],
            trim: true,
            minlength: [2, categoryMessage.minLengthName.replace('{{minLength}}', '2')],
        },
        ngayTao: {
            type: Date,
            default: Date.now,
        },
        ngayCapNhat: {
            type: Date,
            default: Date.now,
        },
    },
);

const Category = mongoose.model('THELOAI', categorySchema);

module.exports = Category;
