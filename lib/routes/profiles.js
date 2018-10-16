const router = require('express').Router();
const Profile = require('../models/Profile');
const { updateOptions } = require('./helpers');

module.exports = router 

    .get('/', ({ user }, res, next) => {
        return Profile.findById(user.profileId)
            .then(profile => res.json(profile))
            .catch(next);
    })

    .put('/', ({ user, body }, res, next) => {
        return Profile.findByIdAndUpdate(
            user.profileId, 
            body,
            updateOptions
        )
            .then(update => res.json(update))
            .catch(next);
    })

    .put('/:id/add-flashcard', ({ user, body }, res, next) => {
        return Profile.findOneAndUpdate(
            user.profileId,
            { $push: { addedFlashcards: body.flashcardId } },
            updateOptions
        )
            .then(flashcard => res.json(flashcard))
            .catch(next);
    });