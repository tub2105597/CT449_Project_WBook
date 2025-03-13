const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const { userMessage } = require('../languages');

const userSchema = mongoose.Schema(
    {
        maDG: {
            type: String,
            required: [true, userMessage.requiredCode],
            unique: true,
            trim: true,
        },
        matKhau: {
            type: String,
            required: [true, userMessage.requiredPassword],
            trim: true,
            minlength: [6, userMessage.minLengthPassword.replace('{{minLength}}', '6')],
            maxlength: [32, userMessage.maxLengthPassword.replace('{{maxLength}}', '32')],
        },
        xacNhanMatKhau: {
            type: String,
            required: [true, userMessage.requiredConfirmPassword],
            trim: true,
            validate: {
                validator: function (value) {
                    return this.matKhau === value;
                },
                message: userMessage.invalidConfirmPassword,
            },
        },
        hoLot: {
            type: String,
            required: [true, userMessage.requiredFirstName],
            trim: true,
            minlength: [2, userMessage.minLengthFirstName.replace('{{minLength}}', '2')],
            maxlength: [40, userMessage.maxLengthFirstName.replace('{{maxLength}}', '40')],
        },
        ten: {
            type: String,
            required: [true, userMessage.requiredLastName],
            trim: true,
            minlength: [1, userMessage.minLengthLastName.replace('{{minLength}}', '1')],
            maxlength: [10, userMessage.maxLengthLastName.replace('{{maxLength}}', '10')],
        },
        ngaySinh: {
            type: Date,
            required: [true, userMessage.requiredBirthday],
            validate: {
                validator: function (value) {
                    return value < new Date();
                },
                message: userMessage.invalidBirthday,
            },
        },
        phai: {
            type: String,
            required: [true, userMessage.requiredGender],
            enum: ['Nam', 'Nữ'],
        },
        diaChi: {
            type: String,
            required: [true, userMessage.requiredAddress],
            trim: true,
            minlength: [5, userMessage.minLengthAddress.replace('{{minLength}}', '5')],
            maxlength: [100, userMessage.maxLengthAddress.replace('{{maxLength}}', '100')],
        },
        soDienThoai: {
            type: String,
            required: [true, userMessage.requiredPhone],
            trim: true,
            validate: {
                validator: function (value) {
                    return validator.isMobilePhone(value, 'vi-VN');
                },
                message: userMessage.invalidPhone,
            },
        },
        kichHoat: {
            type: Boolean,
            default: false,
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
    },
);

// Compare login password
userSchema.methods.comparePassword = async function (password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
};

//Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('matKhau')) {
        return next();
    }

    //If user has aldready created
    this.matKhau = await bcrypt.hash(this.matKhau, 10);
    this.xacNhanMatKhau = undefined;

    next();
});

//Only allow user active login
userSchema.pre(/^find/, function (next) {
    this.find({ kichHoat: { $ne: false } });
    next();
});


const User = mongoose.model('DOCGIA', userSchema);

module.exports = User;