/*
 * These two features seemed out of place everywhere else so I stuck them in here.
 * My plan is for UI.js to manage further user interaction
 * I'm going to incorporate sliders to customize visualizations in real time
 */

// On song selection, load the visualizer
$('#songChoice').on('change', function(){
    //debugger;
    var test = $('#songPath').text();
    Audio(test);
    render(0);
});
// called when play button overlay is clicked. plays audio; runs render()
var play = function() {
    $('#play').fadeOut('normal', function() {
        $(this).remove();
    });
    // initialize sources now
    source.start(0);
};
