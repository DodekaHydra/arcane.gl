// on song selection, load the visualizer
$('#songChoice').on('change', function(){
    //debugger;
    var test = $('#songPath').text();
    Audio(test);
    render(0);
});

var play = function() {
    $('#play').fadeOut('normal', function() {
        $(this).remove();
    });
    // initialize sources now
    source.start(0);
};

document.getElementById('volume').addEventListener('change', function() {
    gainNode.gain.value = this.value;
});