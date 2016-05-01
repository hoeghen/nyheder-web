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

