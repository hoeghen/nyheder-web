var chai = require ('chai')
var feedly = require('../feedly')
var templater = require('../templater')


describe('templater', function () {
    this.timeout(5000);
    it('should return a list lockups', function (done) {
        feedly.getAllNews(function(response){
            var news = JSON.parse(response)
            var result = templater.createDoc(news)
            console.log(result)
            done()
        })

        
        
    });
});