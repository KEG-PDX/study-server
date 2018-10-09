const { assert } = require('chai');
const { getErrors } = require('../helpers');
const Flashcard = require('../../lib/models/Flashcard');
const { Types } = require('mongoose');

describe('flashcard model', () => {
    const data = {
        profileId: Types.ObjectId(),
        category: 'Programming',
        subCategory: 'Javascript',
        question: 'What is a recursive function? Give an example of when using one might be useful.',
        answer: 'Recursive functions call themselves until termination conditions are reached. A simple example would be a counter function that decrements a count until a given number (calling itself for each iteration).',
    };

    let flashcard; 
    beforeEach(() => {
        flashcard = new Flashcard(data);
    });

    it('validates a good model', () => {
        assert.equal(flashcard.profileId, data.profileId);
        assert.equal(flashcard.category, data.category);
        assert.equal(flashcard.subCategory, data.subCategory);
        assert.equal(flashcard.question, data.question);
        assert.equal(flashcard.answer, data.answer);
    });

    it('validates required fields', () => {
        const user = new Flashcard({});
        const errors = getErrors(user.validateSync(), 5);
        assert.equal(errors.profileId.kind, 'required');
        assert.equal(errors.category.kind, 'required');
        assert.equal(errors.subCategory.kind, 'required');
        assert.equal(errors.question.kind, 'required');
        assert.equal(errors.answer.kind, 'required');
    });
});