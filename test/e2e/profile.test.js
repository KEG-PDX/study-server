const { assert } = require('chai');
const request = require('./request');
const { dropCollection, createToken } = require('./db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

describe('Profile API', () => {

    beforeEach(() => dropCollection('profiles'));
    beforeEach(() => dropCollection('users'));

    let token;
    beforeEach(() => createToken().then(t => token = t));

    const expected = {
        name: 'test',
        createdFlashcards: [],
        addedFlashcards: []
    };

    it('gets a profile', () => {
        return request
            .get('/api/profile')
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                /* eslint-disable-next-line */
                const { __v, _id, ...result } = body;
                assert.deepEqual(result, expected);
            });
    });

    it('updates a profile', () => {
        return request
            .put('/api/profile')
            .set('Authorization', token)
            .send({ name: 'updateTest' })  
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.name, 'updateTest');
            }); 
    });
});
