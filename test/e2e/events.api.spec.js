const request = require('supertest');
const server = require('../../src/index.js');
const expect = require('chai').expect;

describe('Events API', function () {
    describe('Get events teams', function () {
        it('should return 200 Http response and events teams if any', async function () {
            await request(server)
                .get('/events/1/teams')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Array');
                    expect(res.body).to.have.lengthOf(1);
                    expect(res.body[0]).to.deep.include({
                        team_Id: 1,
                        project: {
                            id: 1,
                            name: 'Save the Middle Earth',
                            owner: 'The Fellowship of the Ring',
                            description: 'Destroy the ring',
                            image_url: 'http://lotr.org/rivendell.jpg',
                        },
                    })
                })
        })
    });

    describe('Get events teams', function () {
        it('should return 200 Http response and events members if any', async function () {
            await request(server)
                .get('/events/1/members')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Array');
                    expect(res.body).to.have.lengthOf(1);
                    expect(res.body[0]).to.deep.equal(
                    {
                        user_id: 1,
                        full_name: 'Gandalf The Grey',
                        title: 'Wizard',
                        company_name: "The Great Wizards Company",
                        image_url: 'https://uncledanny1979.files.wordpress.com/2010/03/gandalf.jpg',
                        team_id: 1,
                        project_id: 1,
                        project_name: 'Save the Middle Earth',
                        project_owner: 'The Fellowship of the Ring',
                        project_description: 'Destroy the ring',
                        project_image_url: 'http://lotr.org/rivendell.jpg',
                    })
                })
        })
    });
});