/**
 * Module that handles calls to feedly
 *
 * Created by cha on 4/2/2016.
 */
var request = require('request');


var getProviders = function(callback){

    request('https://cloud.feedly.com/v3/search/feeds?query=nyheder&locale=da_DK&count=20', function(error, response, body){
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

var getProviderNews = function(provider,newerThan,callback){
    var feedid = provider.feedId;
    if(newerThan != null){
        request('https://cloud.feedly.com/v3/streams/contents?streamId='+feedid+'&count=10&newerThan='+newerThan, handleResult)
    }else{
        request('https://cloud.feedly.com/v3/streams/contents?streamId='+feedid+'&count=10', handleResult)
    }

    function handleResult (error,response,result)
    {
        if(error) {
            console.log(error);
        }else{
            var entries = paparseEntries(provider,result);
            callback(entries)
        }
    }

}




var cache = {}
var maxAge = 1000*60*5
var maxNumberOfNews = 500

var getAllNews = function(callBack){

    var items
    // only call for new news every maxAge minutes or first time


    function isToOld() {
        return cache.lastUpdate != null && Date.now() - cache.lastUpdate > maxAge;
    }

    function firstTime() {
        return cache.lastUpdate == undefined;
    }

    if(isToOld() || firstTime()){
            getAllNewsFrom(null,function(list){
                cache.lastUpdate = Date.now 
                cache.data = list;
                console.log("fresh result")
                callBack(list);
            })
        }else {
            console.log("cached result")
            callBack(cache.data)
    }
    

}


var getAllNewsFrom = function (newerThan,callback) {

    getProviders(function (result) {
        var allList = [];
        var providers = JSON.parse(result)
        var count = providers.length;

        providers.forEach(function (provider) {
            getProviderNews(provider,newerThan, function (list) {
                count = count - 1;
                if (list.length > 0) {
                    allList.push(list);
                }
                if (count == 0) {
                    callback(JSON.stringify(allList))
                }
            })
        })

    })

};



exports.getProviders = getProviders;
exports.getProviderNews = getProviderNews;
exports.getAllNews = getAllNews;
