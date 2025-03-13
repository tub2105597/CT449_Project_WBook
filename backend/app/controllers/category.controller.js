const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const { filterPayload } = require('../utils/extract.util');
const catchAsync = require('../utils/catchAsync.util');
const { categoryMessage } = require('../languages');

const Category = require('../models/category.model');

exports.getAllCategories = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(Category.find(), { ...req.query });
    mongooseQuery.filter().sort().paginate();

    const categories = await mongooseQuery.query;

    res.status(200).json({
        status: 'success',
        data: { categories },
    });
});

exports.createCategory = catchAsync(async (req, res, next) => {
    const category = await Category.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { category },
    });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        ...req
            .body
    }, {
        new: true,
        runValidators: true,
    });

    if (!category) {
        return next(new ApiError(404, categoryMessage.notFound));
    }

    res.status(200).json({
        status: 'success',
        data: { category },
    });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return next(new ApiError(404, categoryMessage.notFound));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getCategoryBooks = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(Category.findById(req.params.id)
        .populate('books'), { ...req.query });
    mongooseQuery.filter().sort().paginate();

    const category = await mongooseQuery.query;

    if (!category) {
        return next(new ApiError(404, categoryMessage.notFound));
    }

    res.status(200).json({
        status: 'success',
        data: { category },
    });
});

