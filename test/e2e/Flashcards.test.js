const { assert } = require('chai');
const request = require('./request');
const { dropCollection, createToken } = require('./db');
const { checkOk } = request;
const { Types } = require('mongoose');

describe.only('Flashcards API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('flashcards'));

    let token;
    beforeEach(() => createToken().then(t => token = t));

    let recursionFlashcard;
    let codeProblem;
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
    beforeEach(() => {
        let flashcard = {
            profileId: Types.ObjectId(),
            category: 'Programming',
            subCategory: 'General',
            question: 'You can’t work out how to solve a coding problem. What do you do to find the answer?',
            answer: 'First, look at the docs for the technology in question. Stack Overflow or other online resources could be considered second but if I get stuck after a set amount of time, it’s probably best to ask for help.',
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

    it('Gets a list of flashcards', () => {
        return request
            .get('/api/flashcards')
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body[0].category, recursionFlashcard.category);
                assert.deepEqual(body[1].category, codeProblem.category);
                assert.deepEqual(body[0].question, recursionFlashcard.question);
                assert.deepEqual(body[1].question, codeProblem.question);
            });
    });
});