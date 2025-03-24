const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const { filterPayload } = require('../utils/extract.util');
const catchAsync = require('../utils/catchAsync.util');
const { publisherMessage } = require('../languages');

const Publisher = require('../models/publisher.model');

exports.getPublisher = catchAsync(async (req, res, next) => {
    const publisher = await Publisher.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: { publisher },
    });
});

exports.getAllPublishers = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(Publisher.find(), { ...req.query });

    const publishers = await mongooseQuery.query;

    res.status(200).json({
        status: 'success',
        data: { publishers },
    });
});

exports.createPublisher = catchAsync(async (req, res, next) => {
    console.log('publisher: ', req.body);

    const publisher = await Publisher.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { publisher },
    });
});

exports.updatePublisher = catchAsync(async (req, res, next) => {
    const publisher = await Publisher.findByIdAndUpdate(req.params.id, { ...req.body }, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: { publisher },
    });
});

exports.deletePublisher = catchAsync(async (req, res, next) => {
    await Publisher.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getPublisherBooks = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(Publisher.findById(req.params.id).populate('books'), { ...req.query });

    const publisher = await mongooseQuery.query;

    res.status(200).json({
        status: 'success',
        data: { publisher },
    });
});