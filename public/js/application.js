(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


function createNews() {
    Feedly.getAllNews(function (news) {
        var docJson = Templater.createDoc(JSON.parse(news))
        var doc = Presenter.makeDocument(docJson);
        navigationDocument.pushDocument(doc);
    })
}
App.onLaunch = function(options) {
    createNews()
}

App.onResume = function(options) {
    createNews()
}


},{"./Presenter.js":2,"./feedly.js":3,"./templater.js":4}],2:[function(require,module,exports){
/*
Copyright (C) 2016 Apple Inc. All Rights Reserved.
See LICENSE.txt for this sample’s licensing information

Abstract:
Templates can be displayed to the user via three primary means:
- pushing a document on the stack
- associating a document with a menu bar item
- presenting a modal
This class shows examples for each one.
*/

var Presenter = {

    /**
     * @description This function demonstrate the default way of present a document. 
     * The document can be presented on screen by adding to to the documents array
     * of the navigationDocument. The navigationDocument allows you to manipulate
     * the documents array with the pushDocument, popDocument, replaceDocument, and
     * removeDocument functions. 
     *
     * You can replace an existing document in the navigationDocumetn array by calling 
     * the replaceDocument function of navigationDocument. replaceDocument requires two
     * arguments: the new document, the old document.
     * @param {Document} xml - The XML document to push on the stack
     */
    defaultPresenter: function(xml) {

        /*
        If a loading indicator is visible, we replace it with our document, otherwise 
        we push the document on the stack
        */
        if(this.loadingIndicatorVisible) {
            navigationDocument.replaceDocument(xml, this.loadingIndicator);
            this.loadingIndicatorVisible = false;
        } else {
            navigationDocument.pushDocument(xml);
        }
    },

    /**
     * @description Extends the default presenter functionality and registers
     * the onTextChange handler to allow for a search implementation
     * @param {Document} xml - The XML document to push on the stack
     */
    searchPresenter: function(xml) {

        this.defaultPresenter.call(this, xml);
        var doc = xml;

        var searchField = doc.getElementsByTagName("searchField").item(0);
        var keyboard = searchField.getFeature("Keyboard");

        keyboard.onTextChange = function() {
            var searchText = keyboard.text;
            console.log('search text changed: ' + searchText);
            buildResults(doc, searchText);
        }
    },    

    /**
     * @description This function demonstrates the presentation of documents as modals.
     * You can present and manage a document in a modal view by using the pushModal() and
     * removeModal() functions. Only a single document may be presented as a modal at
     * any given time. Documents presented in the modal view are presented in fullscreen
     * with a semi-transparent background that blurs the document below it.
     *
     * @param {Document} xml - The XML document to present as modal
     */
    modalDialogPresenter: function(xml) {
        navigationDocument.presentModal(xml);
    },

    /**
     * @description This function demonstrates how to present documents within a menu bar.
     * Each item in the menu bar can have a single document associated with it. To associate
     * document to you an item you use the MenuBarDocument feature.
     *
     * Menu bar elements have a MenuBarDocument feature that stores the document associated
     * with a menu bar element. In JavaScript you access the MenuBarDocument by invoking the 
     * getFeature function on the menuBar element. 
     *
     * A feature in TVMLKit is a construct for attaching extended capabilities to an
     * element. See the TVMLKit documentation for information on elements with available
     * features.
     *
     * @param {Document} xml - The XML document to associate with a menu bar element
     * @param {Element} ele - The currently selected item element
     */
    menuBarItemPresenter: function(xml, ele) {
        /*
        To get the menu bar's 'MenuBarDocument' feature, we move up the DOM Node tree using
        the parentNode property. This allows us to access the the menuBar element from the 
        current item element.
        */
        var feature = ele.parentNode.getFeature("MenuBarDocument");

        if (feature) {
            /*
            To retrieve the document associated with the menu bar element, if one has been 
            set, you call the getDocument function the MenuBarDocument feature. The function
            takes one argument, the item element.
            */
            var currentDoc = feature.getDocument(ele);
            /*
            To present a document within the menu bar, you need to associate it with the 
            menu bar item. This is accomplished by call the setDocument function on MenuBarDocument
            feature. The function takes two argument, the document to be presented and item it 
            should be associated with.

            In this implementation we are only associating a document once per menu bar item. You can 
            associate a document each time the item is selected, or you can associate documents with 
            all the menu bar items before the menu bar is presented. You will need to experimet here
            to balance document presentation times with updating the document items.
            */
            if (!currentDoc) {
                feature.setDocument(xml, ele);
            }
        }
    },

    /**
     * @description This function handles the select event and invokes the appropriate presentation method.
     * This is only one way to implent a system for presenting documents. You should determine
     * the best system for your application and data model.
     *
     * @param {Event} event - The select event
     */
    load: function(event) {
        console.log(event);

        var self = this,
            ele = event.target,
            templateURL = ele.getAttribute("template"),
            presentation = ele.getAttribute("presentation");

        /*
        Check if the selected element has a 'template' attribute. If it does then we begin
        the process to present the template to the user.
        */
        if (templateURL) {
            /*
            Whenever a user action is taken you need to visually indicate to the user that
            you are processing their action. When a users action indicates that a new document
            should be presented you should first present a loadingIndicator. This will provide
            the user feedback if the app is taking a long time loading the data or the next 
            document.
            */
            self.showLoadingIndicator(presentation);

            /* 
            Here we are retrieving the template listed in the templateURL property.
            */
            resourceLoader.loadResource(templateURL,
                function(resource) {
                    if (resource) {
                        /*
                        The XML template must be turned into a DOMDocument in order to be 
                        presented to the user. See the implementation of makeDocument below.
                        */
                        var doc = self.makeDocument(resource);
                        
                        /*
                        Event listeners are used to handle and process user actions or events. Listeners
                        can be added to the document or to each element. Events are bubbled up through the
                        DOM heirarchy and can be handled or cancelled at at any point.

                        Listeners can be added before or after the document has been presented.

                        For a complete list of available events, see the TVMLKit DOM Documentation.
                        */
                        doc.addEventListener("select", self.load.bind(self));
                        doc.addEventListener("highlight", self.load.bind(self));


                        /*
                        This is a convenience implementation for choosing the appropriate method to 
                        present the document. 
                        */
                        if (self[presentation] instanceof Function) {
                            self[presentation].call(self, doc, ele);
                        } else {
                            self.defaultPresenter.call(self, doc);
                        }
                    }
                }
            );
        }
    },

    /**
     * @description This function creates a XML document from the contents of a template file.
     * In this example we are utilizing the DOMParser to transform the Index template from a 
     * string representation into a DOMDocument.
     *
     * @param {String} resource - The contents of the template file
     * @return {Document} - XML Document
     */
    makeDocument: function(resource) {
        if (!Presenter.parser) {
            Presenter.parser = new DOMParser();
        }

        var doc = Presenter.parser.parseFromString(resource, "application/xml");
        return doc;
    },

    /**
     * @description This function handles the display of loading indicators.
     *
     * @param {String} presentation - The presentation function name
     */
    showLoadingIndicator: function(presentation) {
        /*
        You can reuse documents that have previously been created. In this implementation
        we check to see if a loadingIndicator document has already been created. If it 
        hasn't then we create one.
        */
        if (!this.loadingIndicator) {
            this.loadingIndicator = this.makeDocument(this.loadingTemplate);
        }
        
        /* 
        Only show the indicator if one isn't already visible and we aren't presenting a modal.
        */
        if (!this.loadingIndicatorVisible && presentation != "modalDialogPresenter" && presentation != "menuBarItemPresenter") {
            navigationDocument.pushDocument(this.loadingIndicator);
            this.loadingIndicatorVisible = true;
        }
    },

    /**
     * @description This function handles the removal of loading indicators.
     * If a loading indicator is visible, it removes it from the stack and sets the loadingIndicatorVisible attribute to false.
     */
    removeLoadingIndicator: function() {
        if (this.loadingIndicatorVisible) {
            navigationDocument.removeDocument(this.loadingIndicator);
            this.loadingIndicatorVisible = false;
        }
    },

    /**
     * @description Instead of a loading a template from the server, it can stored in a property 
     * or variable for convenience. This is generally employed for templates that can be reused and
     * aren't going to change often, like a loadingIndicator.
     */
    loadingTemplate: `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <loadingTemplate>
            <activityIndicator>
              <text>Loading...</text>
            </activityIndicator>
          </loadingTemplate>
        </document>`
}


module.exports = Presenter
},{}],3:[function(require,module,exports){
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
    maxNews: 100,
    maxProviders:10,

    urlCache: {

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
            return JSON.stringify(providers)
        }
    },

    parseEntries: function (provider, result) {
        function stripHtml(html){
            return html.replace(/<(?:.|\n)*?>/gm, '');
        }
        var parsed = JSON.parse(result);
        var entries = [];
        if (parsed.items) {
            parsed.items.forEach(function (item) {
                console.log("parsing item ="+item)
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


                newsItem.published = item.published;
                newsItem.provider = provider.name;
                if (newsItem.visual  && newsItem.visual.length > 10) {
                    if(newsItem.summary && newsItem.summary.length > 10)
                        entries.push(newsItem)

                }
            });
        }
        return JSON.stringify(entries)
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

    getAllNews: function (callBack) {
        var self = this
        var items
        // only call for new news every maxAge minutes or first time

        function isToOld() {
            return self.feedcache.lastUpdate != null && Date.now() - self.feedcache.lastUpdate > this.maxAge;
        }

        function firstTime() {
            if(!self.feedcache.lastUpdate){
                return true
            }else{
                return false
            }
        }

        if (true ||firstTime() ||  isToOld() ) {
            this.getAllNewsFrom(null, function (list) {
                self.feedcache.lastUpdate = Date.now
                self.feedcache.data = list;
                callBack(list);
            })
        } else {
            callBack(self.feedcache.data)
        }


    },

    getAllNewsFrom: function (newerThan, callback) {
        var self = this
        this.getProviders(function (result) {
            var allList = [];
            var providers = JSON.parse(result)
            var count = providers.length;

            providers.forEach(function (provider) {
                self.getProviderNews(provider, newerThan, function (list) {
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




module.exports = Feedly
},{}],4:[function(require,module,exports){
// version 2

String.prototype.replaceAll = function(search, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
}


var Templater = {
    createDoc : function(data){
        var self = this
        var lockups = ""

        data.forEach(function(item){
            var lockup = self.construct(item.visual,item.title,item.summary,item.provider)
            lockups = lockups+lockup
        })
        var doc = this.fullDoc(lockups)
        return this.encode(doc)
    },

    construct : function(image,title,summary,provider){
        var itemXML =
            `<lockup>
                <img src="${image}" width="1220" />
                <title>${title}</title>
                <description allowsZooming="true">${summary} - ${provider}</description>
             </lockup>`
        return itemXML
    },

    fullDoc : function(lockups,provider) { return `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
           <showcaseTemplate>
              <background>
              <img src="http://www.bodiehodgesfoundation.co.uk/wp-content/uploads/2013/05/new-black-silver-grey-background-wallpaper-desktop-background.jpg"/>
              </background>
              <banner>
                 <title>Danske Nyheder</title>
              </banner>
              <carousel>
                 <section>
                    ${lockups}
                 </section>
              </carousel>
           </showcaseTemplate>
        </document>`
    },
    
    encode : function(doc) {
        function removeAmp(result) {
            return result.replaceAll("&","&amp;")
        }
        var encodedDoc = removeAmp(doc)
        return encodedDoc
    }
    
    
}
    


module.exports = Templater


},{}]},{},[1]);
