let request = require('supertest');
const server = require('../../index.js');

request = request(server);

describe('Test API', function() {

    describe('Test endpoint', function () {
        it('should return a 200 Http response', async function () {
            await request
                .get('/hello/test')
                .expect(200)
        })
    });
});