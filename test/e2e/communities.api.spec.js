const request = require('supertest');
const server = require('../../src/index.js');
const expect = require('chai').expect;

describe('Communities API', function() {
    describe('Get communities', function () {
        it('should return 200 Http response and communities if any', async function () {
            await request(server)
                .get('/communities')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Array');
                    expect(res.body).to.have.lengthOf(1);
                    expect(res.body[0]).to.include({
                        id: 1,
                        name: 'The Community of the Ring',
                        description: 'Save the Middle Earth',
                        image_url: 'http://lotr.org/rivendell.jpg',
                    })
                })
        })
    });

    describe('Get community', function () {
        it('should return 200 Http response and community if any', async function () {
            await request(server)
                .get('/communities/1')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.include({
                        id: 1,
                        name: 'The Community of the Ring',
                        description: 'Save the Middle Earth',
                        image_url: 'http://lotr.org/rivendell.jpg',
                    })
                })
        })
    });

    describe('Get community events', function () {
        it('should return 200 Http response and community events if any', async function () {
            await request(server)
                .get('/communities/1/events')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Array');
                    expect(res.body).to.have.lengthOf.at.least(2);
                    expect(res.body[0]).to.include({
                        id: 1,
                        name: 'The Rivendell assembly',
                        hours: 50,
                        description: 'Save the Middle Earth',
                        image_url: 'http://lotr.org/rivendell.jpg',
                        date: '1954-07-29T00:00:00.000Z'
                    })
                })
        })
    });

    describe('Get community leaderboard', function () {
        it('should return 200 Http Status response with the most active community team members (based on contributed hours)',
            async function () {
                await request(server)
                    .get('/communities/1/leaderboard')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an('Array');
                        expect(res.body).to.have.lengthOf.at.least(2);

                        expect(res.body[0]).to.include({
                            id: 1,
                            name: 'Gandalf The Grey',
                            company: 'The Great Wizards Company',
                            title: 'Wizard',
                            image_url: 'https://uncledanny1979.files.wordpress.com/2010/03/gandalf.jpg',
                            events: 1,
                            projects: 1,
                            hours: 50
                        });
                        expect(res.body[1]).to.include({
                            id: 3,
                            name: 'Bilbo',
                            title: 'The Hobbit',
                            events: 1,
                            projects: 1,
                            hours: 8
                        })
                    })
            })
    })
});

