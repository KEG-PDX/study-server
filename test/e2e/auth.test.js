const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth API', () => {

    beforeEach(() => dropCollection('users'));

    let token;

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'test',
                email: 'test@test.com',
                password: 'test'
            })
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up user', () => {
        assert.ok(token);
    });

    it('verifies', () => {
        return request
            .get('/api/auth/verify')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.isOk(body.verified);
            });
    });

    it('logins user', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'test'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });
});