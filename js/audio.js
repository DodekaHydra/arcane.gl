//var Audio = function(passedUrl){
    var context, source, sourceJs, analyser, buffer,
        array = [],
        boost = 0,
        url = './data/Amon-Tobin_Surge.mp3';

    var interval = window.setInterval(function() {
        var $dots = $('loading_dots');
        if($dots.text().length < 3) {
            $dots.text($dots.text() + '.');
        }
        else {
            $dots.text('');
        }
    }, 500);

    try {
        if(typeof webkitAudioContext === 'function') {
            context = new webkitAudioContext();
        }
        else {
            context = new AudioContext();
        }
    }
    catch(e) {
        $('#info').text('Web Audio API is not supported in this browser');
    }

    var request = new XMLHttpRequest();
        request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        var $play_link = $('#play_link'),
            $play = $('#play'),
            $info = $('#info');
        context.decodeAudioData(
            request.response,
            function(buffer) {
                if(!buffer) {
                    $info.text('Error decoding file data');
                    return;
                }

                sourceJs = context.createJavaScriptNode(2048);
                sourceJs.buffer = buffer;
                sourceJs.connect(context.destination);
                analyser = context.createAnalyser();
                analyser.smoothingTimeConstant = 0.6;
                analyser.fftSize = 512;

                source = context.createBufferSource();
                source.buffer = buffer;
                source.loop = true;

                source.connect(analyser);
                analyser.connect(sourceJs);
                source.connect(context.destination);

                sourceJs.onaudioprocess = function(e) {
                    debugger;
                    array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    boost = 0;
                    for (var i = 0; i < array.length; i++) {
                        boost += array[i];
                    }
                    boost = boost / array.length;
                };

                /*$('#info')
                    .fadeOut('normal', function() {
                        $(this).html('<div id="artist"><a class="name" href="http://www.looperman.com/users/profile/345547" target="_blank">Cufool</a><br /><a class="song" href="http://www.looperman.com/tracks/detail/70506" target="_blank">You in my world instrumental</a><br /></div><div><img src="data/cufool.jpg" width="58" height="58" /></div>');
                    })
                    .fadeIn();
                */
                clearInterval(interval);

                // popup
                $('body').append($('<div onclick="play();" id="play" style="width: ' + $(window).width() + 'px; height: ' + $(window).height() + 'px;"><div id="play_link"></div></div>'));
                var $play_link = $('#play_link'),
                    $play = $('#play');
                $play_link.css('top', ($(window).height() / 2 - $play_link.height() / 2) + 'px');
                $play_link.css('left', ($(window).width() / 2 - $play_link.width() / 2) + 'px');
                $play.fadeIn();
            },
            function(error) {
                $info.text('Decoding error:' + error);
            }
        );
    };

    request.onerror = function(e) {
        $('#info').text(''+e+'buffer: XHR error');
    };

    request.send();

    function displayTime(time) {
        if(time < 60) {
            return '0:' + (time < 10 ? '0' + time : time);
        }
        else {
            var minutes = Math.floor(time / 60);
            time -= minutes * 60;
            return minutes + ':' + (time < 10 ? '0' + time : time);
        }
    }

    function play() {
        $('#play').fadeOut('normal', function() {
            $(this).remove();
        });
        source.noteOn(0);
    }

    $(window).resize(function() {
        var $play_link = $('#play_link'),
            $play = $('#play');
        if($play.length === 1) {
            $play.width($(window).width());
            $play.height($(window).height());

            if($play_link.length === 1) {
                $play_link.css('top', ($(window).height() / 2 - $play_link.height() / 2) + 'px');
                $play_link.css('left', ($(window).width() / 2 - $play_link.width() / 2) + 'px');
            }
        }
    });
//};