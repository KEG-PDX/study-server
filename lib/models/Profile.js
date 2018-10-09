const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdFlashcards: [{
        type: Schema.Types.ObjectId,
        ref: 'Flashcards'
    }],
    addedFlashcards: [{
        type: Schema.Types.ObjectId,
        ref: 'Flashcards'
    }]
});

module.exports = mongoose.model('Profile', schema);