**nodejs powerpoint hand-control example**

this example code using OpenCV to recognize fist in movie.

And You can control powerpoint presentation, moving yoy fist to left and right

Thanks for opencv fist.xml model

Thanks for slideshow module: 

I have had have to solve a error bug in OSX, to compute slide number in the original code.
 

Design Choices
There are two separates modules.
gestureControl.js to get hand detection
endPointServer.js to load and control powerpont presentation
This module is a basic http server with powerpoint api - rest  

The architecture I used for this application has been chosen to make it work without any 
kind of cloud dependency (cognitive services). 

Goal
nodejs source takes images from web cam devices or video movies, split in images and call
process to detect objects in this image, inside a loop.

a possible use of this code would be to detect advertisements in videos or images, 
and be able to count the time spent on screen of the same, or it can be used for a 
facial recognition system.

Requirements 
opencv4nodejs
(see: https://www.npmjs.com/package/opencv4nodejs)

MacOS / OSX
cmake brew install cmake

run:

npm install

[gestureControl.js]

This module detect hand & fist from video / webcam image device

You can change classifier, if you want to use others

[endPointServer.js]

Basic https server with apiRest (get methods).
Its used to control powerpoint presentations through  slideShow module.

start server with:

node endPointServer.js
start gesture control with:

node gestureControl.js

(c) Nacho Ariza - 25/03/2019

MIT License