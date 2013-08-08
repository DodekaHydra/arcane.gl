arcane.gl
=========
##WebGL Music Visualizer

###TO RUN:

+ [Acquire Python](http://www.python.org/download/) [2.x or 3.x is fine]

+ From Terminal/CMD, Run:

        Python 2.x
        python -m SimpleHTTPServer 8081
    or
        Python 3.x
        python -m http.server 8081

+ From browser of choice, enter the url

        localhost:8081 or 127.0.0.1:8081

###Once setup:

Select a song from the dropdown list. 

        Mandala and Surge are most reactive, Gemini is sort of an edge case.

Volume is controlled by a slider. Clear button doesn't work properly.

After song selection, wait for a play button to appear on screen. On click, the visualization begins.

*Left click* and drag to **rotate** camera. *Right click* and drag to **pan** camera. *Two finger/scroll* to **zoom**.

###Tech Stack:

WebGL/THREE.js - GPU

Knockout.js    - UI

JQuery         - DOM
