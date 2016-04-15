/**
 * Module that handles calls to feedly
 *
 * Created by cha on 4/2/2016.
 */

var Feedly = {
    feedcache: {
        lastUpdate:undefined
    },
    maxAge: 1000 * 60 * 5,
    maxNews: 20,
    maxProviders:2,

    getProviders: function (callback) {

        request('https://cloud.feedly.com/v3/search/feeds?query=nyheder&locale=da_DK&count='+maxProviders, function (body) {
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
            return JSON.stringify(providers)
        }
    },

    parseEntries: function (provider, result) {
        var parsed = JSON.parse(result);
        var entries = [];
        if (parsed.items) {
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
                if (item.visual) {
                    entries.push(newsItem)
                }
            });
        }
        return JSON.stringify(entries)
    },

    getProviderNews: function (provider, newerThan, callback) {
        var feedid = provider.feedId;
        if (newerThan != null) {
            request('https://cloud.feedly.com/v3/streams/contents?streamId=' + feedid + '&count=5&newerThan=' + newerThan, handleResult)
        } else {
            request('https://cloud.feedly.com/v3/streams/contents?streamId=' + feedid + '&count=5', handleResult)
        }

        function handleResult(result) {
            var entries = paparseEntries(provider, result);
            callback(entries)
        }

    },

    request: function (url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callback(xmlhttp.responseText);
            } else {
                console.log("failed request " + url)
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    },

    getAllNews: function (callBack) {

        var items
        // only call for new news every maxAge minutes or first time

        console.log("feedcache="+this.feedcache.lastUpdate)

        function isToOld() {
            return this.feedcache.lastUpdate != null && Date.now() - this.feedcache.lastUpdate > this.maxAge;
        }

        function firstTime() {
            if(!this.feedcache.lastUpdate){
                return true
            }else{
                return false
            }
        }

        if (firstTime() ||  isToOld() ) {
            getAllNewsFrom(null, function (list) {
                this.feedcache.lastUpdate = Date.now
                this.feedcache.data = list;
                console.log("fresh result")
                callBack(list);
            })
        } else {
            console.log("cached result")
            callBack(this.feedcache.data)
        }


    },

    getAllNewsFrom: function (newerThan, callback) {

        getProviders(function (result) {
            var allList = [];
            var providers = JSON.parse(result)
            var count = providers.length;

            providers.forEach(function (provider) {
                getProviderNews(provider, newerThan, function (list) {
                    count = count - 1;
                    if (list.length > 0) {
                        var listArray = JSON.parse(list)
                        allList.push.apply(allList, listArray);
                    }
                    if (count == 0) {
                        callback(JSON.stringify(allList))
                    }
                })
            })

        })

    }
}








