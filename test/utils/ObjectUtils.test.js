const expect = require('chai').expect;
const ObjectUtils = require('../../src/utils/ObjectUtils.js');

describe('Object Utils', function () {
    describe('prefixAllProperties', function () {
        it('returns a profile with a company as an empty object if not found', function () {
            // Given
            const objectUtils = new ObjectUtils();
            const object = {
                id: 1,
                name: 'foo'
            };
            const expected = {
                project_id: 1,
                project_name: 'foo'
            };

            // When
            const result = objectUtils.prefixAllProperties(object, 'project_');

            // Then
            expect(result).to.deep.equal(expected);
        });
    });
});