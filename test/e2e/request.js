const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const http = require('http');
const { assert } = chai;

const app = require('../../lib/app');

const server = http.createServer(app);
const request = chai.request(server).keepOpen();

request.checkOk = res => {
    if(res.status !== 200) console.log('res status ', res.status);
    assert.equal(res.status, 200, 'expected http 200 status code');
    return res;
};

after(() => server.close());

module.exports = request;