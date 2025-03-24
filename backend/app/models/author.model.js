const mongoose = require('mongoose');

const { authorMessage } = require('../languages');

const authorSchema = mongoose.Schema(
    {
        tenTG: {
            type: String,
            required: [true, authorMessage.requiredName],
            trim: true,
            minlength: [2, authorMessage.minLengthName.replace('{{minLength}}', '2')],
        },
    }
);

const Author = mongoose.model('TACGIA', authorSchema);

module.exports = Author;

