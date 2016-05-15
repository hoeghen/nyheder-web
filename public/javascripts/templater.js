// version 2
var Templater = {
    createDoc : function(data){
        var self = this
        var lockups = ""

        data.forEach(function(item){
            var lockup = self.construct(item.visual,item.title,item.summary,item.provider,item.published)
            lockups = lockups+lockup
        })
        
        return this.fullDoc(lockups)
    },

    construct : function(image,title,summary,provider,published){
        var itemXML =
            `<lockup>
                <img src="${image}" width="1220" />
                <title>${title}</title>
                <description allowsZooming="true">${summary} - ${provider} - ${published}</description>
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
    }
    
}

module.exports = Templater

