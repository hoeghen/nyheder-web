var chai = require ('chai')


var feedly = require('../feedly')
describe('feedly', function() {
    describe('getProviders', function () {
        it('should return a list of providers', function (done) {
                
            var providers = feedly.getProviders();

            chai.expect(providers).to.be.json();


            done();
        });
    });
});