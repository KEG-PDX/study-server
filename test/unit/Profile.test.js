const { assert } = require('chai');
const { getErrors } = require('../helpers');
const Profile = require('../../lib/models/Profile');

describe('Profile model', () => {
    const data = {
        name: 'test'
    };

    let profile;

    beforeEach(() => {
        profile = new Profile(data);
    });

    it('validates a good model', () => {
        assert.equal(profile.name, data.name);
        assert.property(profile, 'createdFlashcards');
        assert.lengthOf(profile.createdFlashcards, 0, 'empty array');
        assert.property(profile, 'addedFlashcards');
        assert.lengthOf(profile.addedFlashcards, 0, 'empty array');
    });

    it('validates required fields', () => {
        const profile = new Profile({});
        const errors = getErrors(profile.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');

    });
});