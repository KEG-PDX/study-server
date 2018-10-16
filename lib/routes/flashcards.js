const router = require('express').Router();
const ensureAuth = require('../auth/ensure-auth')();
const Flashcard = require('../models/Flashcard');
const Profile = require('../models/Profile');
const { updateOptions } = require('./helpers');
const { HttpError, resource404 } = require('../util/errors');

module.exports = router

    .post('/', ensureAuth, (req, res, next) => {
        let flashcardId;
        Flashcard.create(req.body)
            .then(flashcard => {
                flashcardId = flashcard._id;
                res.json(flashcard);
                return Profile.findOneAndUpdate(
                    { _id: req.user.profileId },
                    { $push: { createdFlashcards: flashcardId } });
            })
            .catch(next);
    })

    .get('/', ensureAuth, (req, res, next) => {
        Flashcard.find()
            .lean()
            .then(flashcards => {
                res.json(flashcards);
            })
            .catch(next);
    })

    .get('/:id', ensureAuth, (req, res, next) => {
        Flashcard.findById(req.params.id)
            .lean()
            .then(flashcard => {
                if(!flashcard) next(resource404());
                else res.json(flashcard);
            })
            .catch(next);
    })

    .put('/:id', ensureAuth, (req, res, next) => {
        Flashcard.findById(req.params.id)
            .lean()
            .then(flashcard => {
                if(flashcard.profileId == req.user.profileId) {
                    Flashcard.findByIdAndUpdate(
                        req.params.id,
                        req.body,
                        updateOptions
                    )
                        .then(flashcard => {
                            res.json(flashcard);
                        })
                        .catch(next);
                }
                else {
                    next(new HttpError({
                        code: 403,
                        message: 'Forbidden - Not the owner of this resource'
                    }));
                }
            })
            .catch(next);
    });