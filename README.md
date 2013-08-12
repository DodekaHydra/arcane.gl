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

        Mandala and Surge are most reactive, Gemini is a minimalistic edge case, Pockets is a bass-heavy edge case.

Volume is controlled by a slider. Clear button doesn't work properly.

After song selection, wait for a play button to appear on screen. On click, the visualization begins.

*Left click* and drag to **rotate** camera. *Right click* and drag to **pan** camera. *Two finger/scroll wheel* to **zoom**.

###Technical Achievements:

+ Audio is at 24 hz. Rendering happens at 60 fps. An async callback pings the renderer with new data. If the renderer receives new data, it uses it; otherwise it has its own animation tasks to work on.

+ Since the visual is 2.5x faster [24hz*2.5=60] than audio data, animations were originally extremely jagged. To compensate, I pushed the renderer back a single frame, undetectably out of sync with the audio, to create a single tween frame.

+ Transitions occur in by comparing the current audio data with the previous frame's audio data. These values are the sum across all frequencies. Upon a certain threshold being crossed, a flag is assigned for the next frame. If enough time has passed, the transition is trigger. Alternately, if enough time passes with no trigger, the transition still occurs.

+ Colors are dynamically modified trigonometrically. Colors are modified by using time, cube position, cube indices, frequencies, and static scalars as sin/cos parameters

+ The z axis is manipulated over time, with an expansion and retraction depending on values, as well as influencing x and y positions for several scenes. 

+ radial arc length is determined in mathUtils.js and used for certain scenes 

###Tech Stack:

WebGL/THREE.js - GPU

Knockout.js    - UI

JQuery         - DOM
