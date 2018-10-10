const { assert } = require('chai');
const request = require('./request');
const { dropCollection, createToken } = require('./db');
const { checkOk } = request;
const { Types } = require('mongoose');

describe('Flashcards API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('flashcards'));

    let token;
    beforeEach(() => createToken().then(t => token = t));

    let recursionFlashcard;
    beforeEach(() => {
        let flashcard = {
            profileId: Types.ObjectId(),
            category: 'Programming',
            subCategory: 'Javascript',
            question: 'What is a recursive function? Give an example of when using one might be useful.',
            answer: 'Recursive functions call themselves until termination conditions are reached. A simple example would be a counter function that decrements a count until a given number (calling itself for each iteration).',
        };
        return request
            .post('/api/flashcards')
            .set('Authorization', token)
            .send(flashcard)
            .then(checkOk)
            .then((res) => {
                recursionFlashcard = res.body;
            });
    });

    it('Saves a flashcard', () => {
        assert.isOk(recursionFlashcard);
    });
});