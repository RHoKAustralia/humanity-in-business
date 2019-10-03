const expect = require('chai').expect;

const CompanyService = require('../../src/services/CompanyService.js');
const companyService = new CompanyService();

describe('Company Service', function () {

    describe('isSameCompany', function () {
        it('returns true if companies have same name but different case', function () {
            const isSame = companyService.isSameCompany('google', 'Google');
            expect(isSame).to.be.true;
        });
        it('returns false if companies have different name', function () {
            const isSame = companyService.isSameCompany('Foo', 'Bar');
            expect(isSame).to.be.false;
        });
    });
});