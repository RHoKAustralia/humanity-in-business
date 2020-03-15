const sinon = require('sinon');
const expect = require('chai').expect;

const UserService = require('../../src/services/UserService.js');

describe('Company Service', function () {
    describe('user profile', function () {
        it('returns a profile with a company as an empty object if not found', async function () {
            // Given
            const userService = new UserService();
            const stub = sinon.stub(userService.userRepository);
            stub.getUserCompany = sinon.stub().resolves(undefined);

            const userId = 1;

            // When
            const profile = await userService.getUserProfile(userId);

            // Then
            expect(profile.company).to.be.empty;
        });
    });
});