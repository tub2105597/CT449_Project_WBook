const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const { staffMessages } = require('../languages');

const staffSchema = new mongoose.Schema(
    {
        maNV: {
            type: String,
            required: [true, staffMessages.requiredCode],
            unique: true,
            trim: true,
        },
        hoTen: {
            type: String,
            required: [true, staffMessages.requiredName],
            trim: true,
            minlength: [2, staffMessages.minLengthName.replace('{{minLength}}', '2')],
            maxlength: [40, staffMessages.maxLengthName.replace('{{maxLength}}', '40')],
        },
        matKhau: {
            type: String,
            required: [true, staffMessages.requiredPassword],
            minlength: [6, staffMessages.minLengthPassword.replace('{{minLength}}', '6')],
            maxlength: [32, staffMessages.maxLengthPassword.replace('{{maxLength}}', '32')],
        },
        vaiTro: {
            type: String,
            required: [true, staffMessages.requiredRole],
            enum: ['admin', 'staff'],
        },
        diaChi: {
            type: String,
            required: [true, staffMessages.requiredAddress],
            trim: true,
        },
        soDienThoai: {
            type: String,
            required: [true, staffMessages.requiredPhone],
            validate: {
                validator: function (value) {
                    return validator.isMobilePhone(value, 'vi-VN');
                },
                message: staffMessages.invalidPhone,
            },
        },
        kichHoat: {
            type: Boolean,
            default: false,
            select: false,
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

staffSchema.pre('save', async function (next) {
    if (this.isModified('matKhau')) {
        this.matKhau = await bcrypt.hash(this.matKhau, 8);
    }
    next();
});

staffSchema.methods.comparePassword = async function (password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
}

//Only allow user active login
staffSchema.pre(/^find/, function (next) {
    this.find({ kichHoat: { $ne: false } });
    next();
});

const Staff = mongoose.model('NHANVIEN', staffSchema);

module.exports = Staff;