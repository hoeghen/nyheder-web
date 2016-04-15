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
         <img src="${this.BASEURL}resources/images/iceland/iceland_19_full_screen.jpg" />
      </background>
      <banner>
         <title>Scenes</title>
         <row>
            <button>
               <text>Slideshow</text>
            </button>
            <button>
               <text>Screensaver</text>
            </button>
         </row>
      </banner>
      <carousel>
         <section>
            <lockup>
               <img src="${this.BASEURL}resources/images/iceland/iceland_1_landscape.jpg" width="620" height="419" />
               <title>Scene 1</title>
            </lockup>
            <lockup>
               <img src="${this.BASEURL}resources/images/iceland/iceland_3_landscape.jpg" width="620" height="419" />
               <title>Scene 2</title>
            </lockup>
            <lockup>
               <img src="${this.BASEURL}resources/images/iceland/iceland_4_landscape.jpg" width="620" height="419" />
               <title>Scene 3</title>
            </lockup>
            <lockup>
               <img src="${this.BASEURL}resources/images/iceland/iceland_6_landscape.jpg" width="620" height="419" />
               <title>Scene 4</title>
            </lockup>
         </section>
      </carousel>
   </showcaseTemplate>
</document>`
}
