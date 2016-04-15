/*
 Copyright (C) 2016 Apple Inc. All Rights Reserved.
 See LICENSE.txt for this sample’s licensing information

 Abstract:
 Use the showcase template to display a row of images with descriptions associated with each image; for example, displaying a set of screenshots to promote a movie.

 Users can scroll between images. When an image comes into focus, the size of the image is increased to be slightly larger than the other images.
 */
var Template = function() { return `<?xml version="1.0" encoding="UTF-8" ?>
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
