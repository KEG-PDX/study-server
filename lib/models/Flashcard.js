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
        required: false
    },
    subCategory: {
        type: String,
        required: false
    },
    question: {
        type: String,
        required: true,
        maxlength: 420
    },
    answer: {
        type: String,
        required: true,
        maxlength: 420
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Flashcard', schema);