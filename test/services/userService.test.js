const sinon = require('sinon');
const expect = require('chai').expect;

const UserService = require('../../src/services/UserService.js');

describe('User Service', function () {
    describe('user profile', function () {
        it('returns a profile with a company as an empty object if not found', async function () {
            // Given
            const stub = sinon.stub(UserService.userRepository);
            stub.getUserCompany = sinon.stub().resolves(undefined);
            const userService = new UserService();

            const userId = 1;

            // When
            const profile = await userService.getUserProfile(userId);

            // Then
            expect(profile.company).to.be.empty;
        });
    });
});