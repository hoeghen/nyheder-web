var chai = require ('chai')
var feedly = require('../feedly')
var templater = require('../templater')


describe('templater', function () {
    it('should return a list lockups', function (done) {
        feedly.getAllNews(function(response){
            var news = JSON.parse(response)
            var result = templater.applyData(null,news)
            console.log(result)
            done()
        })

        
        
    });
});