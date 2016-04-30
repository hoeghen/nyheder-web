var chai = require ('chai')
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
                feedly.getProviderNews(provider,null,function(providerNews){
                    var providerNewsList = JSON.parse(providerNews)
                    chai.expect(providerNewsList).to.be.a('array');
                    done1()
                })

            })
        });
    });

    describe('getAllNews', function () {
        this.timeout(5000);
        it('should return a list of all news', function (done) {
            feedly.getAllNews(function(response){
                var news = JSON.parse(response)
                chai.expect(news).to.be.a('array');
                done()
            })
        });
    });
    describe('getAllNews2', function () {
        this.timeout(5000);
        it('should return a list of all news', function (done) {
            feedly.getAllNews(function(response){
                var news = JSON.parse(response)
                chai.expect(news).to.be.a('array');
                done()
            })
        });
    });

});