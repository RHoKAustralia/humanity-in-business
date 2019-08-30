const request = require('supertest');
const server = require('../../src/index.js');
const expect = require('chai').expect

const TeamService = require('../../src/services/TeamService.js');
const teamService = new TeamService();

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

    describe('User join an team', function () {
        it('should return 201 Http response', async function () {
            await request(server)
                .post('/teams/1/members')
                .send({
                    user_id: 2
                })
                .set('Content-Type', 'application/json')
                .expect(201)

            await request(server)
                .get('/teams/1/members')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Array');
                    expect(res.body).to.have.lengthOf(2);
                    expect(res.body[1]).to.have.property('user_id', 2);
                })
        });

        after(async function() {
            await teamService.removeMember(1, 2);
        });
    });

    describe('Get team members', function () {
        it('should return 200 Http response with team members', async function () {
            await request(server)
                .get('/teams/1/members')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('Array');
                    expect(res.body).to.have.lengthOf.at.least(1);
                    expect(res.body).to.deep.include({
                        user_id: 1,
                        full_name: 'Gandalf The Grey',
                        title: 'Wizard',
                        image_url: 'https://uncledanny1979.files.wordpress.com/2010/03/gandalf.jpg'
                    })
                })
        })
    })
});