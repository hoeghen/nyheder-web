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
var loadingDocTmp = "<document><loadingTemplate><activityIndicator><title>Henter dagens nyheder</title></activityIndicator></loadingTemplate></document>";
var contentDoc;
var loadingDoc

function createNews() {
    console.log("calling getAllNews")
    Feedly.getAllNews(function (news) {
        console.log("all news loaded = "+news.length)
        var docJson = Templater.createDoc(news)
        console.log("news doc created")
        contentDoc = Presenter.makeDocument(docJson);
        navigationDocument.replaceDocument(contentDoc,loadingDoc);
        console.log("news doc pushed")
    })
}
function updateNews() {
    console.log("updating news")
    Feedly.getAllNews(function (news) {
        console.log("all news loaded")
        var docJson = Templater.createDoc(news)
        var newdoc = Presenter.makeDocument(docJson);
        console.log("news doc created")
        navigationDocument.replaceDocument (newdoc,loadingDoc);
        contentDoc = newdoc;
    })
}

App.onLaunch = function(options) {
    loadingDoc = Presenter.makeDocument(loadingDocTmp);
    console.log("created loading doc")
    navigationDocument.pushDocument(loadingDoc)
    console.log("pushed loadinf doc")
    createNews()
}

App.onResume = function(options){
    console.log("onResume")
    navigationDocument.clear()

    loadingDoc = Presenter.makeDocument(loadingDocTmp);
    console.log("created loading doc")
    navigationDocument.pushDocument(loadingDoc)
    console.log("pushed loadinf doc")
    createNews()}