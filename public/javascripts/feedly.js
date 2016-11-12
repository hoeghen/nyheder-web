/**
 * Module that handles calls to feedly
 *
 * Created by cha on 4/2/2016.
 */

var NodeRequester = require("xmlhttprequest").XMLHttpRequest;
var NodeCache = require("node-cache");

var Feedly = {
    feedcache: {
        lastUpdate:undefined
    },
    maxAge: 1000 * 60 * 5,
    maxNews: 30,
    maxProviders:10,
    newsCache : new NodeCache({ stdTTL: 60*60*24, checkperiod: 60*5}),


    request: function (url, callback) {
        // The XmlHttpRequest is not available outside appletv context so we need this to run unit tests
        var xmlhttp;
        if (typeof XMLHttpRequest === 'function'){
            xmlhttp = new XMLHttpRequest();
        }else{
            xmlhttp = new NodeRequester();
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4){
                if(xmlhttp.status = 200){
                    callback(xmlhttp.responseText);
                }else{
                    console.log("failed request " + url)
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    },

    getProviders: function (callback) {

        this.request('https://cloud.feedly.com/v3/search/feeds?query=nyheder&locale=da_DK&count='+this.maxProviders, function (body) {
            callback(parse(body))
        });

        function parse(body) {
            var providers = [];
            var response = JSON.parse(body);
            var results = response.results;
            results.forEach(function (result) {
                var provider = {};
                provider.feedId = result.feedId;
                provider.name = result.website;
                if (provider.name == null) {
                    provider.name = result.title
                }
                provider.iconUrl = result.iconUrl;
                providers.push(provider)
            });
            return providers
        }
    },

    parseEntries: function (provider, result) {
        var self=this;
        function stripHtml(html){
            return html.replace(/<(?:.|\n)*?>/gm, '');
        }
        var parsed = JSON.parse(result);
        var entries = [];
        if (parsed.items) {
            parsed.items.forEach(function (item) {
                var newsItem = {};
                newsItem.title = item.title;
                if (item.summary){
                    var wrapped = "<![CDATA["+item.summary.content+"]]>";
                    var strippedContent = stripHtml(item.summary.content);
                    newsItem.summary = strippedContent
                }
                newsItem.content = item.content;
                if (item.visual && item.visual.url){
                    newsItem.visual = item.visual.url;
                }


                newsItem.published = new Date(item.published).toDateString();
                newsItem.timeStamp = item.published;
                newsItem.provider = provider.name;

                if (newsItem.visual  && newsItem.visual.length > 10) {
                    if(newsItem.summary && newsItem.summary.length > 10){
                        if(!self.newsCache.get(newsItem.visual)){
                            self.newsCache.set(newsItem.visual,newsItem);
                        }
                    }
                }
            });
        }
        var keys = self.newsCache.keys();

        keys.forEach(function(key){
            entries.push(self.newsCache.get(key))
        })
        return entries;
    },

    getProviderNews: function (provider, newerThan, callback) {
        var self = this
        var feedid = provider.feedId;
        if (newerThan != null) {
            this.request('https://cloud.feedly.com/v3/streams/contents?streamId=' + feedid + '&count='+this.maxNews+'&newerThan=' + newerThan, handleResult)
        } else {
            this.request('https://cloud.feedly.com/v3/streams/contents?streamId=' + feedid + '&count='+this.maxNews, handleResult)
        }

        function handleResult(result) {
            var entries = self.parseEntries(provider, result);
            callback(entries)
        }

    },

    getSomeNews: function (antal,callBack) {
        this.getAllNewsFrom(null, function (list) {
            list.sort(function(a,b){
                return b.timeStamp - a.timeStamp;
            })
            callBack(list.slice(0,antal));
        })
    },
    getAllNews: function(callback){
      return this.getSomeNews(10,callback);
    },
    getAllNewsFrom: function (newerThan, callback) {
        var self = this
        this.getProviders(function (result) {
            var allList = [];
            var providers = result
            var count = providers.length;

            providers.forEach(function (provider) {
                self.getProviderNews(provider, newerThan, function (list) {
                    count = count - 1;
                    if (count == 0) {
                        callback(list)
                    }
                })
            })

        })

    }
}




module.exports = Feedly