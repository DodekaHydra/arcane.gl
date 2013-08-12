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

    /** onAudio(callback)
     ** callback() : audio-sensitive visualizer data
     **   @array   : frequency data array
     **   @boost   : data array scalar
     **   @newData : alerts render() to new data */
    onAudio(function(array, boost){
        render.array = array;
        render.boost = boost;
        render.newData = true;
    });

    render();
};

var onAudio = function(cb){

    sourceJs.onaudioprocess = function(e) {

        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var boost = 0;

        for (var i = 0; i < array.length; i++) {
            boost += array[i];
        }
        boost = boost/ array.length;
        if(cb && boost>.1) cb(array, boost);

    };
};