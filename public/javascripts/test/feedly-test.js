var chai = require ('chai')
var chailike = require('chai-like')
chai.use(chailike)


var feedly = require('../feedly')
describe('feedly', function() {
    describe('getProviders', function () {
        it('should return a list of providers', function (done) {

            feedly.getProviders(function(response){
                var providers = JSON.parse(response)
                chai.expect(providers).to.be.a('array');
                providers.forEach(function(item){
                    chai.expect(item).to.include.keys('feedId','name')
                })
                done();
            });

        });
    });
    describe('getProviderNews', function () {
        it('should return a list of news', function (done1) {
            feedly.getProviders(function(response){
                var providers = JSON.parse(response)
                var provider = providers[0]
                feedly.getProviderNews(provider,function(providerNews){
                    var providerNewsList = JSON.parse(providerNews)
                    chai.expect(providerNewsList).to.be.a('array');
                    done1()
                })

            })
        });
    });

    describe('getAllNews', function () {
        it('should return a list of all news', function (done) {
            feedly.getAllNews(function(response){
                var news = JSON.parse(response)
                chai.expect(news).to.be.a('array');
                console.log(news)
                done()
            })
        });
    });

});