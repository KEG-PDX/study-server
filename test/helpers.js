const { assert } = require('chai');
const request = require('./e2e/request');
const { checkOk } = request;

const getErrors = (validation, numberExpected) => {
    assert.isDefined(validation);
    const errors = validation.errors;
    assert.equal(Object.keys(errors).length, numberExpected);
    return errors;
};

const save = (data, token, route) => {
    return request
        .post(`/api/${route}`)
        .set('Authorization', token)
        .send(data)
        .then(checkOk)
        .then(({ body }) => {
            return body;
        });
};

module.exports = {
    getErrors,
    save
};