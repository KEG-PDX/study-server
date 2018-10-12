const router = require('express').Router();
const { sign } = require('../auth/token-service');
const ensureAuth = require('../auth/ensure-auth')();
const User = require('../models/User');
const Profile = require('../models/Profile');
const { HttpError } = require('../util/errors');

const hasEmailAndPassword = ({ body }, res, next) => {
    const { email, password } = body;
    if(!email || !password) {
        throw {
            status: 400,
            error: 'Email and password required'
        };
    }
    next();
};

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })
    .post('/signup', hasEmailAndPassword, ({ body }, res, next) => {
        const { email, password, name } = body;
        delete body.password;
        return User.exists({ email })
            .then(exists => {
                if(exists) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email exists'
                    });
                }
                const user = new User(body);
                const profile = new Profile({ name });
                user.profileId = profile._id;

                user.generateHash(password);
                return Promise.all([user.save(), profile.save()]);
            })
            .then(([user, profile]) => {
                return res.json({ token: sign(user), profile }); 
            })
            .catch(next);
    })
    .post('/signin', hasEmailAndPassword, ({ body }, res, next) => {
        const { email, password } = body;
        delete body.password;
        let user;
        return User.findOne({ email })
            .then(_user => {
                user = _user;
                if(!user || !user.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'Invalid email or password'
                    });
                }
                const { profileId } = user;
                return Profile.findById(profileId);
            })
            .then(profile => {
                return res.json({ token: sign(user), profile });
            })
            .catch(next);
    });