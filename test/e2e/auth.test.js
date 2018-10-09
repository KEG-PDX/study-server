const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('profiles'));

    let token, profile;

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
                profile = body.profile;
            });
    });

    it('signs up user', () => {
        assert.ok(token);
        assert.equal(profile.name, 'test');
        assert.property(profile, 'createdFlashcards');
        assert.property(profile, 'addedFlashcards');
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

    it('Gives 400 on signup of same email', () => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'test@test.com',
                password: 'test'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email exists');
            });
    });

    it('Gives 401 on non-existent email', () => {
        return request  
            .post('/api/auth/signin')
            .send({
                email: 'bad@email.com',
                password: 'test'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });

    it('Gives 401 on bad password', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'badPassword'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });
});