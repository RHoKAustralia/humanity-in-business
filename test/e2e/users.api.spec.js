const request = require('supertest');
const server = require('../../src/index.js');
const expect = require('chai').expect;

const UserService = require('../../src/services/UserService.js');
const userService = new UserService();

const CompanyService = require('../../src/services/CompanyService.js');
const companyService = new CompanyService();

describe('Users API', function() {

    describe('Register user', function () {
        let newUserId;
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

    describe('Save user company',  function () {
        describe('when company already exits', function () {
            const userId = 2;

            it('should return new user company', async function() {
                await request(server)
                    .put(`/users/${userId}/company`)
                    .send({
                        name: "The Great Wizards Company"
                    })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.contains({
                            id: 1,
                            name: "The Great Wizards Company"
                        });
                    });
            });

            after(async function() {
                await userService.removeCompany(userId);
            });
        });

        describe('when company doesn\'t exits', function () {
            const userId = 2;
            let companyId;

            it('should create new company and return new user company', async function() {
                await request(server)
                    .put(`/users/${userId}/company`)
                    .send({
                        name: "The Great Warriors Company"
                    })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        const company = res.body;
                        expect(company).to.have.property('id');
                        expect(company.id).to.be.an('Number');
                        expect(company).to.have.property("name", "The Great Warriors Company");

                        companyId = company.id;
                    });
            });

            after(async function() {
                await userService.removeCompany(userId);
                await companyService.removeCompany(companyId);
            });
        });
    });

    describe('Get user details', function () {
        it('should return a 200 with user details', async function () {
            await request(server)
                .get('/users/1/profile')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.deep.equal({
                        id: 1,
                        full_name: "Gandalf The Grey",
                        title: "Wizard",
                        image_url: "https://uncledanny1979.files.wordpress.com/2010/03/gandalf.jpg",
                        hours: 50,
                        communities: [{
                            id: 1,
                            name: "The Community of the Ring"
                        }]
                    });
                });
        });
    });
});