const mongoose = require('mongoose');
const slugify = require('slugify');

const { productMessage } = require('../languages');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, productMessage.requiredName],
            trim: true,
            unique: true,
            minlength: [3, productMessage.minlengthName],
            maxlength: [250, productMessage.maxlengthName]
        },
        price: {
            type: Number,
            required: [true, productMessage.requiredPrice],
            min: [0, productMessage.minPrice]
        },
        stockQuantity: {
            type: Number,
            required: [true, productMessage.requiredStockQuantity],
            min: [0, productMessage.minStockQuantity]
        },
        publishYear: {
            type: Number,
            required: [true, productMessage.requiredPublishYear],
            min: [1900, productMessage.minPublishYear],
            max: [new Date().getFullYear(), productMessage.maxPublishYear]
        },
        publisher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Publisher',
            required: [true, productMessage.requiredPublisher]
        },
        categories: {
            type: [{ type: String }],
        },
        images: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
            default: ''
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, productMessage.requiredCreatedBy]
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false
    }
);

productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;