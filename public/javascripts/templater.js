var createDoc = function(data){

    var lockups

    data.forEach(function(item){
        var lockup = construct(item.visual,item.title,item.summary)
        lockups = lockups+lockup
    })
    
    return fullDoc(lockups)
}

var construct = function(image,title,summary){
    var itemXML =
        `<lockup>
                <img src="${image}" width="620" height="419" />
                <title>${title}</title>
                <description>${summary}</description>
             </lockup>`
    return itemXML
}


var fullDoc = function(lockups) { return `<?xml version="1.0" encoding="UTF-8" ?>
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


