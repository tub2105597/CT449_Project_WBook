const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const { staffMessage } = require('../languages');

const staffSchema = new mongoose.Schema(
    {
        maNV: {
            type: String,
            required: [true, staffMessage.requiredCode],
            unique: true,
            trim: true,
        },
        hoTen: {
            type: String,
            required: [true, staffMessage.requiredName],
            trim: true,
            minlength: [2, staffMessage.minLengthName.replace('{{minLength}}', '2')],
            maxlength: [40, staffMessage.maxLengthName.replace('{{maxLength}}', '40')],
        },
        matKhau: {
            type: String,
            required: [true, staffMessage.requiredPassword],
            minlength: [6, staffMessage.minLengthPassword.replace('{{minLength}}', '6')],
            maxlength: [32, staffMessage.maxLengthPassword.replace('{{maxLength}}', '32')],
        },
        vaiTro: {
            type: String,
            required: [true, staffMessage.requiredRole],
        },
        diaChi: {
            type: String,
            required: [true, staffMessage.requiredAddress],
            trim: true,
        },
        soDienThoai: {
            type: String,
            required: [true, staffMessage.requiredPhone],
            validate: {
                validator: function (value) {
                    return validator.isMobilePhone(value, 'vi-VN');
                },
                message: staffMessage.invalidPhone,
            },
        },
        kichHoat: {
            type: Boolean,
            default: true
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
        this.matKhau = await bcrypt.hash(this.matKhau, 10);
    }
    next();
});

staffSchema.methods.comparePassword = async function (password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
}

const Staff = mongoose.model('NHANVIEN', staffSchema);

module.exports = Staff;