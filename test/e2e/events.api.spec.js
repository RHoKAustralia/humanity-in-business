const request = require('supertest');
const server = require('../../src/index.js');
const expect = require('chai').expect;

describe('Events API', function () {
    describe('Get events projects', function () {
        it('should return 200 Http response and communities if any', async function () {
            await request(server)
                .get('/events/1/projects')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Array');
                    expect(res.body).to.have.lengthOf(1);
                    expect(res.body[0]).to.include({
                        id: 1,
                        name: 'Save the Middle Earth',
                        owner: 'The Fellowship of the Ring',
                        description: 'Destroy the ring',
                        image_url: 'http://lotr.org/rivendell.jpg',
                    })
                })
        })
    });
});