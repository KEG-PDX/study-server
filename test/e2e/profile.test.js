const { assert } = require('chai');
const request = require('./request');
const { dropCollection, createToken } = require('./db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected 200 http status code');
    return res;
};

describe('Profile API', () => {

    before(() => dropCollection('profiles'));
    before(() => dropCollection('users'));

    let token;
    beforeEach(() => createToken().then(t => token = t.token));

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
});
