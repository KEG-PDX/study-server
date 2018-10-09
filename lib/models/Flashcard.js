const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema ({
    profileId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true,
        maxlength: 500
    },
    answer: {
        type: String,
        required: true,
        maxlength: 500
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Flashcard', schema);