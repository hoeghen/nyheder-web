// version 2
var Templater = {
    createDoc : function(data){
        var self = this
        var lockups = ""

        data.forEach(function(item){
            var lockup = self.construct(item.visual,item.title,item.summary,item.provider)
            lockups = lockups+lockup
        })
        
        return this.fullDoc(lockups)
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



