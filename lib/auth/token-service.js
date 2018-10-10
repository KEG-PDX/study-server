require('dotenv').config();
const jwt = require('jsonwebtoken');
const appSecret = process.env.APP_SECRET || 'app-secret';

module.exports = {
    sign(user) {
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            profileId: user.profileId
        };
        return jwt.sign(payload, appSecret);
    },
    verify(token) {
        return jwt.verify(token, appSecret);
    }
};