const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const { filterPayload } = require('../utils/extract.util');
const catchAsync = require('../utils/catchAsync.util');
const { authorMessage } = require('../languages');

const Author = require('../models/author.model');

exports.getAuthor = catchAsync(async (req, res, next) => {
    const author = await Author.findById(req.params.id);

    if (!author) {
        return next(new ApiError(404, authorMessage.notFound));
    }

    res.status(200).json({
        status: 'success',
        data: { author },
    });
});

exports.getAllAuthors = catchAsync(async (req, res, next) => {
    const mongooseQuery = new MongooseQuery(Author.find(), { ...req.query });

    const authors = await mongooseQuery.query;

    res.status(200).json({
        status: 'success',
        data: { authors },
    });
});

exports.createAuthor = catchAsync(async (req, res, next) => {
    const author = await Author.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { author },
    });
});

exports.updateAuthor = catchAsync(async (req, res, next) => {
    const author = await Author.findByIdAndUpdate(req.params.id, { ...req.body }, {
        new: true,
        runValidators: true,
    });

    if (!author) {
        return next(new ApiError(404, authorMessage.notFound));
    }

    res.status(200).json({
        status: 'success',
        data: { author },
    });
});

exports.deleteAuthor = catchAsync(async (req, res, next) => {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
        return next(new ApiError(404, authorMessage.notFound));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getAuthorBooks = catchAsync(async (req, res, next) => {
    const author = await Author.findById(req.params.id);

    if (!author) {
        return next(new ApiError(404, authorMessage.notFound));
    }

    const books = await author.populate('books').execPopulate();

    res.status(200).json({
        status: 'success',
        data: { books: author.books },
    });
});


