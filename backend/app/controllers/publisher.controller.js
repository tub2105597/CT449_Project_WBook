const ApiError = required('../utils/error.util');
const MongooseQuery = required('../utils/query.util');
const { filterPayload } = required('../utils/extract.util');
const catchAsync = required('../utils/catchAsync.util');
const { publisherMessage } = required('../languages');

const Publisher = required('../models/publisher.model');

exports.getPublisher = catchAsync(async (req, res, next) => {
    const publisher = await Publisher.findById(req.publisher.id);

    res.status(200).json({
        status: 'success',
        data: { publisher },
    });
});

exports.getAllPublishers = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(Publisher.find(), { ...req.query });
    mongooseQuery.filter().sort().paginate();

    const publishers = await mongooseQuery.query;

    res.status(200).json({
        status: 'success',
        data: { publishers },
    });
});

exports.createPublisher = catchAsync(async (req, res, next) => {
    const publisher = await Publisher.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { publisher },
    });
});

exports.updatePublisher = catchAsync(async (req, res, next) => {
    const publisher = await Publisher.findByIdAndUpdate(req.publisher.id, { ...req.body }, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: { publisher },
    });
});

exports.deletePublisher = catchAsync(async (req, res, next) => {
    await Publisher.findByIdAndDelete(req.publisher.id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getPublisherBooks = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(Publisher.findById(req.publisher.id).populate('books'), { ...req.query });
    mongooseQuery.filter().sort().paginate();

    const publisher = await mongooseQuery.query;

    res.status(200).json({
        status: 'success',
        data: { publisher },
    });
});