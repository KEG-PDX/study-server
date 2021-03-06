const { verify } = require('./token-service');
const { HttpError } = require('../util/errors');

module.exports = function getEnsureAuth() {
    
    return function ensureAuth(req, res, next) {
        const token = req.get('Authorization');
        try {
            if(!token) return next({ code: 401, error: 'No Authorization Found' });
            const payload = verify(token);
            req.user = payload;  
            next();
        }
        catch(err) {
            next(new HttpError({
                status: 401,
                error: 'Invalid token'
            }));
        }
    };
};