/*
 * These two features seemed out of place everywhere else so I stuck them in here.
 * My plan is for UI.js to manage further user interaction
 * I'm going to incorporate sliders to customize visualizations in real time
 */

// called when play button overlay is clicked; plays audio+runs render()
var play = function() {

    $(document.getElementById('play')).fadeOut('normal', function() {
        $(this).remove();
    });

    // starts the audio
    source.start(0);
    render();
};