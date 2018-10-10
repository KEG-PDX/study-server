const { assert } = require('chai');
const { Types } = require('mongoose');
const request = require('./request');
const { checkOk } = request;
const { save } = require('../helpers');
const { dropCollection, createToken } = require('./db');

describe.only('Flashcards API', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('flashcards'));

    let token;
    beforeEach(() => createToken().then(t => token = t));

    let recursionFlashcard;
    let getInfoFlashcard;
    
    beforeEach(() => {
        return save(
            {
                profileId: Types.ObjectId(),
                category: 'Programming',
                subCategory: 'Javascript',
                question: 'What is a recursive function? Give an example of when using one might be useful.',
                answer: 'Recursive functions call themselves until termination conditions are reached. A simple example would be a counter function that decrements a count until a given number (calling itself for each iteration).',
            },
            token,
            'flashcards'
        )
            .then(data => {
                recursionFlashcard = data;
            });
    });

    beforeEach(() => {
        return save(
            {
                profileId: Types.ObjectId(),
                category: 'Programming',
                subCategory: 'General',
                question: 'You can’t work out how to solve a coding problem. What do you do to find the answer?',
                answer: 'First, look at the docs for the technology in question. Stack Overflow or other online resources could be considered second but if I get stuck after a set amount of time, it’s probably best to ask for help.',
            },
            token,
            'flashcards'
        )
            .then(data => {
                getInfoFlashcard = data;
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
                assert.deepEqual(body[0], recursionFlashcard);
                assert.deepEqual(body[1], getInfoFlashcard);
            });
    });

    it('Gets a flashcard by ID', () => {
        return request
            .get(`/api/flashcards/${recursionFlashcard._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, recursionFlashcard);
            });
    });

    it('Updates a flashcard by ID', () => {
        recursionFlashcard.category = 'NEW CATEGORY'
    })
});