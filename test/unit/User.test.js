const { assert } = require('chai');
const { getErrors } = require('../helpers');
const User = require('../../lib/models/User');

describe('User model', () => {
    const credentials = {
        email: 'test@test.com',
        password: 'test123',
        roles: []
    };

    let user;

    beforeEach(() => {
        user = new User(credentials);
        user.generateHash(credentials.password);
    });

    it('validates a good model', () => {
        assert.equal(user.email, credentials.email);
        assert.isDefined(user.hash, 'hash is defined');
        assert.notEqual(user.hash, credentials.password, 'hash is different than password');
        assert.isTrue(user.comparePassword(credentials.password), 'compare good password');
        assert.isFalse(user.comparePassword('bad password'), 'compare bad password');
        assert.isUndefined(user.password, 'password has been hashed');
        assert.isNotNull(user.roles, 'roles field exists');
    });

    it('validates required fields', () => {
        const user = new User({});
        const errors = getErrors(user.validateSync(), 3);
        assert.equal(errors.profileId.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
    });
});