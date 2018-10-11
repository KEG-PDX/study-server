const router = require('express').Router();
const ensureAuth = require('../auth/ensure-auth')();
const Flashcard = require('../models/Flashcard');
const { updateOptions } = require('./helpers');
const { HttpError } = require('../util/errors');

module.exports = router

    .post('/', ensureAuth, (req, res, next) => {
        Flashcard.create(req.body)
            .then(flashcard => res.json(flashcard))
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
                res.json(flashcard);
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
                        message: 'Forbidden - Not the owner of this asset'
                    }));
                }
            })
            .catch(next);
    });