/**
 * Created by cha on 4/2/2016.
 */
var request = require('request');


var getProviders = function(callback){

    request('https://cloud.feedly.com/v3/search/feeds?query=nyheder&locale=da_DK&count=50', function(error, response, body){
        if(error) {
            console.log(error);
        }else{
            callback(parse(body))
        }
    });

    function parse(body){
        var providers = [];
        var response = JSON.parse(body);
        var results = response.results;
        results.forEach(function(result){
            var provider = {};
            provider.feedId = result.feedId;
            provider.name = result.website;
            if(provider.name == null){
                provider.name = result.title
            }
            provider.iconUrl = result.iconUrl;
            providers.push(provider)
        });
        return JSON.stringify(providers)
    }
//    http.get("https://cloud.feedly.com/v3/search/feeds?query=nyheder&locale=da_DK&count=50",function(){



//https://cloud.feedly.com//v3/streams/contents?streamId=feed/http://borsen.dk/services/newsfeed/rss/&count=20
};


function paparseEntries(provider,result) {
    var parsed = JSON.parse(result);
    var entries = [];
    if(parsed.items) {
       parsed.items.forEach(function (item) {
            var newsItem = {};
            newsItem.title = item.title;
            if (item.summary)
                newsItem.summary = item.summary.content;
            newsItem.content = item.content;
            if (item.visual)
                newsItem.visual = item.visual.url;
            newsItem.published = item.published;
            newsItem.provider = provider.name;
            entries.push(newsItem)
        });
    }
    return JSON.stringify(entries)
}

var getProviderNews = function(provider,callback){
    var feedid = provider.feedId;
    request('https://cloud.feedly.com//v3/streams/contents?streamId='+feedid+'&count=20', function(error, response, result){
        if(error) {
            console.log(error);
        }else{
            var entries = paparseEntries(provider,result);
            callback(entries)
        }
    });

};


var getAllNews = function(callback){


    getProviders(function(result){
        var allList =  [];
        var providers = JSON.parse(result)
        var count = providers.length;

        providers.forEach(function(provider){
            getProviderNews(provider,function(list){
               allList.push(list);
                count = count-1;
                if(count == 0){
                    callback(JSON.stringify(allList))
                }
            })
        })

    })

};


exports.getProviders = getProviders;
exports.getProviderNews = getProviderNews;
exports.getAllNews = getAllNews;