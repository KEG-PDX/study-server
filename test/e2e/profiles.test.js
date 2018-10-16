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
    beforeEach(() => dropCollection('flashcards'));

    let token;
    let profile;
    beforeEach(() => createToken().then(t => {
        token = t.token;
        profile = t.profile;
    }));

    const expected = {
        name: 'test',
        createdFlashcards: [],
        addedFlashcards: []
    };

    it('gets a profile', () => {
        return request
            .get('/api/profiles')
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
            .put('/api/profiles')
            .set('Authorization', token)
            .send({ name: 'updateTest' })  
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.name, 'updateTest');
            }); 
    });

    it('adds a flashcard to addedFlashcards', () => {
        const flashcard = {
            profileId: profile._id,
            category: 'category',
            subCategory: 'subCategory',
            question: 'knock knock?',
            answer: 'be quiet.',
        };

        let flashcardId;
        return request
            .post('/api/flashcards')
            .set('Authorization', token)
            .send(flashcard)
            .then(checkOk)
            .then(({ body }) => flashcardId = body._id)
            .then(() => {
                return request
                    .put(`/api/profiles/${profile._id}/add-flashcard`)
                    .set('Authorization', token)
                    .send({ flashcardId })
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.lengthOf(body.addedFlashcards, 1);
                    });
            });
    });

});
