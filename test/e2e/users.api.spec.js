const request = require('supertest');
const server = require('../../src/index.js');
const expect = require('chai').expect;

const UserService = require('../../src/services/UserService.js');
const userService = new UserService();

const CompanyService = require('../../src/services/CompanyService.js');
const companyService = new CompanyService();

describe('Users API', function () {

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
                    image_url: "http://test.jpg"
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
                        image_url: "http://test.jpg"
                    });

                    return res.body.id;
                });
        });

        after(async function () {
            await userService.removeUser(newUserId);
        });
    });

    describe('Update User job details', function () {
        describe('when company already exits with the same name', function () {
            const userId = 2;

            it('should return updated user company and job title', async function () {
                await request(server)
                    .post(`/users/${userId}/job-details`)
                    .send({
                        company_name: "The Great Wizards Company",
                        title: "Great White Wizard"
                    })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.contains({
                            company_id: 1,
                            company_name: "The Great Wizards Company",
                            title: "Great White Wizard"
                        });
                    });
            });

            after(async function () {
                const previoustitle = 'Wizard';
                await userService.removeCompany(userId);
                await userService.updateTitle(userId, previoustitle)
            });
        });

        describe('when company doesn\'t exits', function () {
            const userId = 2;
            let companyId;

            it('should create new company and return new user company', async function () {
                await request(server)
                    .post(`/users/${userId}/job-details`)
                    .send({
                        company_name: "The Great Warriors Company",
                        title: "Great White Wizard"
                    })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        const jobDetails = res.body;
                        expect(jobDetails).to.have.property('company_id');
                        expect(jobDetails.company_id).to.be.an('Number');
                        expect(jobDetails).to.include({
                            company_name: "The Great Warriors Company",
                            title: "Great White Wizard"
                        });

                        companyId = jobDetails.company_id;
                    });
            });

            after(async function () {
                const previoustitle = 'Wizard';
                await userService.removeCompany(userId);
                await companyService.removeCompany(companyId);
                await userService.updateTitle(userId, previoustitle)
            });
        });
    });

    describe('Get user profile', function () {
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
                            name: "The Community of the Ring",
                            description: 'Save the Middle Earth',
                            image_url: 'http://lotr.org/rivendell.jpg',
                        }]
                    });
                });
        });
    });

    describe('Get user events', function () {
        it('should return a 200 and user events', async function () {
            await request(server)
                .get('/users/1/events')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.deep.equal([
                        {
                            id: 1,
                            community_id: 1,
                            name: 'The Rivendell assembly',
                            hours: 50,
                            description: 'Save the Middle Earth',
                            image_url: 'http://lotr.org/rivendell.jpg',
                            date: '1954-07-29T00:00:00.000Z',
                            location: 'Rivendell'
                        }
                    ]);
                });
        });
    });

    describe('Update/Create hib details', function () {
        describe('should return 400 if hib-details are missing', function () {
            const userId = 1;
            it('should return the reason to join hib for a user', async function () {
                await request(server)
                    .post(`/users/${userId}/hib-details`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Missing why_join_hib property in request body');
                    })
            });

            after(async function () {
                await userService.udpdateHibDetails(userId, null);
            });
        });

        describe('Update reason to join hib', function () {
            const userId = 1;
            it('should return the reason to join hib for a user', async function () {
                await request(server)
                    .post(`/users/${userId}/hib-details`)
                    .send({
                        why_join_hib: "This is an awesome project !!!",
                        yearly_days_pledged: 20
                    })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.deep.equal({
                            why_join_hib: "This is an awesome project !!!",
                            yearly_days_pledged: 20
                        })
                    })
            });

            after(async function () {
                await userService.udpdateHibDetails(userId, null);
            });
        });
    });

    describe('Update User details', function () {
        describe('Update image url', function () {
            const newImageUrl = 'http://myImage.jpg';
            const oldImageUrl = 'https://uncledanny1979.files.wordpress.com/2010/03/gandalf.jpg';

            it('should return user with updated image', async function () {
                await request(server)
                    .patch('/users/1')
                    .send({
                        image_url: newImageUrl
                    })
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.deep.equal({
                            id: 1,
                            company_id: 1,
                            full_name: 'Gandalf The Grey',
                            email: 'gandalf@theshire.com',
                            title: 'Wizard',
                            image_url: newImageUrl,
                        });
                    });
            });

            after(async function () {
                await userService.updateUserImageUrl(oldImageUrl, 1);
            });
        });
    });

    describe('Get User communities', function () {
        it('should return user communities', async function () {
            await request(server)
                .get('/users/1/communities')
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
    })
});