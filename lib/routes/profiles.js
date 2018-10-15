const router = require('express').Router();
const Profile = require('../models/Profile');

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
            {
                new: true,
                runValidators: true
            })
            .then(update => res.json(update))
            .catch(next);
    });