//# sourceURL=application.js

/*
Version 2
Copyright (C) 2016 Apple Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
This is the entry point to the application and handles the initial loading of required JavaScript files.
*/


/**
 * @description The onLaunch callback is invoked after the application JavaScript 
 * has been parsed into a JavaScript context. The handler is passed an object 
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the 
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents 
 * the URL that was used to retrieve the application JavaScript.
 */

var Feedly = require('./feedly.js')
var Presenter = require('./Presenter.js')
var Templater = require('./templater.js')

String.prototype.replaceAll = function(search, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
}

App.onLaunch = function(options) {
        Feedly.getAllNews(function(news){
            function removeAmp(result) {
                return result.replaceAll("&","&amp;")
            }
            console.log("news" +news)
                var finalDoc = Templater.createDoc(JSON.parse(news))
                console.log("unencoded"+encodedDoc)    
                var encodedDoc = removeAmp(finalDoc)
                console.log("encoded"+encodedDoc)
                var doc = Presenter.makeDocument(encodedDoc);
                navigationDocument.pushDocument(doc);
            })
}


