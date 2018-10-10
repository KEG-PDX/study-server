const { assert } = require('chai');
const request = require('./request');
const { dropCollection, createToken } = require('./db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

describe.only('Profile API', () => {

    before(() => dropCollection('profiles'));
    before(() => dropCollection('users'));

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
                const { __v, _id, ...result } = body;
                assert.deepEqual(result, expected);
            });
    });

});