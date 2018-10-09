const router = require('express').Router();
const { sign } = require('../auth/token-service');
const ensureAuth = require('../auth/ensure-auth')();
const User = require('../models/User');

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
        const { email, password } = body;
        delete body.password;
        return User.exists({ email })
            .then(exists => {
                if(exists) {
                    throw {
                        status: 400,
                        error: 'Email exists'
                    };
                }
                const user = new User(body);
                user.generateHash(password);
                return user.save();
            })
            .then(user => {
                return res.json({ token: sign(user) }); 
            })
            .catch(next);
    })
    .post('/signin', hasEmailAndPassword, ({ body }, res, next) => {
        const { email, password } = body;
        delete body.password;

        return User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw {
                        status: 401,
                        error: 'Invalid email or password'
                    };
                }
                return res.json({ token: sign(user) });
            })
            .catch(next);
    });