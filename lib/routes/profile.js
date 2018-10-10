const router = require('express').Router();
const Profile = require('../models/Profile');

module.exports = router 

    .get('/', ({ user }, res, next) => {
        return Profile.findById(user.profileId)
            .then(profile => res.json(profile));
    });