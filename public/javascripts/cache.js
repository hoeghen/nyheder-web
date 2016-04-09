/**
 * Created by cha on 09-04-2016.
 */

var cache_size = 1000
var cache = {}
var cachedelay = 5 min

var getItems = function(timestamp,noItems,loadFunction){
    // first time
    if(!cache.lastUpdate){
        cache.lastUpdate = Date.now()
        cache.items = loadFunction(null)
        return items;
    }
    cø  
    if cached timestamp is later than 5 minutes then get news from that timestamp
        add the new news  and remove the oldest so that we have 1000 left in the cache




}