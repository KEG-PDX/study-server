const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Profile API', () => {

    before(() => dropCollection('profile'));
    

});