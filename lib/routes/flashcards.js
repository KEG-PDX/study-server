const router = require('express').Router();
const ensureAuth = require('../auth/ensure-auth')();
const Flashcard = require('../models/Flashcard');

module.exports = router

    .post('/', ensureAuth, (req, res, next) => {
        Flashcard.create(req.body)
            .then(flashcard => res.json(flashcard))
            .catch(next);
    });