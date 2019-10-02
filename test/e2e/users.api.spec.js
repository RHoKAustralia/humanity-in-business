const request = require('supertest');
const server = require('../../src/index.js');
const expect = require('chai').expect;

const UserService = require('../../src/services/UserService.js');
const userService = new UserService();

describe('Users API', function() {

    describe('Register user', function () {
        let newUserId
        it('should create new user', async function () {
            newUserId = await request(server)
                .post('/register')
                .send({
                    full_name: "test",
                    email: "foo2@bar.com",
                    title: "Rocket Scientist",
                    password: "password",
                    image_url:"http://test.jpg"
                })
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.id).to.be.an('Number');

                    expect(res.body).to.contains({
                        full_name: "test",
                        email: "foo2@bar.com",
                        title: "Rocket Scientist",
                        image_url:"http://test.jpg"
                    });

                    return res.body.id;
                });
        });

        after(async function() {
            await userService.removeUser(newUserId);
        });
    });
});