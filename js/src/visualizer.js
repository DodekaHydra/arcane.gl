// @last    increments @counter each second
// @visual  starting point for the visual style
var last = 0, counter = 0, lastScale=[], cycleCount = 0, position = 3,
    animationTrigger = false, triggerDetector = 0,
    randX = randomizer(5), randY = randomizer(5), randZ = randomizer(5);

var render = function (cycles) {
    var array = render.array || null;
    var boost = render.boost || 0;
    var newData = this.newData || false;
    //new THREE.Matrix4().makeRotationY(.001*randY ).multiplyVector3( camera.up );

    // enter loop if BitArray exists and play button has been pressed
    if(array && typeof array === 'object' && array.length > 0 && $('#play').length === 0) {

        // increment counter each second
        if (cycles - last > 1000) {
            last = cycles;
            counter++;
        }

        // every 600 frames,
        if (!cycleCount % 600){
            randX = randomizer(5);
            randY = randomizer(5);
            randZ = randomizer(5);
        }

        // k represents an index in the bit array
        var k = 0;

        /*
         * @lastScale = previous fully completed data sequence of frequency data
         * @tempScale = current scale sequence
         */
        var iLen = cubes.length, jLen = cubes[0].length,
                arcDeg = 360./iLen, maxCycle = 50,
                lotusSize = [], tempScale = [],
                rand9 = randomizer(9), rand4 = randomizer(4);

        for(var i = 0; i < iLen; i++) {

            tempScale[i] = [];
            lastScale[i] = lastScale[i] || [];

            for(var j = 0; j < jLen; j++) {

                var timeScale = counter+(cycles-last)/1000; // ms since play()

                k += (k < array.length ? 1 : 0);

                lastLen = lastScale.length;

                /** @frameTween : current audio data; 24 hz[==fps]
                 **   render()  : 60fps
                 **
                 ** @tempScale  :  on newData, render a point between current+previous audio frames
                 **                otherwise, render current audio frame
                 ** render() will undetectably be 1 visual frame behind the current audio */
                var frameTween = (array[k] + boost) / 30;
                tempScale[i][j] = newData ? (lastScale[lastLen-1][i][j]+frameTween)/2 : frameTween;

                if (newData)
                    triggerDetector += tempScale[i][j];

                var smoothScale = cycleCount>0 ? smoothen(tempScale[i][j], lastScale[lastLen-1][i][j]) : tempScale[i][j];
                var damp = dampen(tempScale[i][j]);

                var degree = arcDeg*(j);
                var radian = degree*(Math.PI/180.);

                /** @scale.y; primary scalar domain **/
                cubes[i][j].scale.y         = 2.0*smoothScale + 6.0*tempScale[i][j];
                     cubes[i][j].scale.x    = smoothScale/randX+damp;
                     cubes[i][j].scale.z    = smoothScale/randZ+damp;

                /** @positionScale, time scalar for position
                 ** range(timeScale) == [10-50]
                 ** maxCycle         == 50 */
                var positionScale = (timeScale+10)/(maxCycle/5.);

                switch (position%4){

                    case 0: // expanding cluster
                        cubes[i][j].position.x = (iLen-i+positionScale)*Math.cos(radian);
                        cubes[i][j].position.y = (iLen-i+positionScale)*Math.sin(radian);
                        break;

                    case 1: // lotus
                        cubes[i][j].position.x = (iLen-i+positionScale)*damp*Math.cos(radian);
                        cubes[i][j].position.y = (iLen-i+positionScale)*damp*Math.sin(radian);
                        break;

                    case 2: // tight cluster
                        cubes[i][j].position.x = (iLen-i+positionScale)/positionScale*damp*Math.cos(radian);
                        cubes[i][j].position.y = (iLen-i+positionScale)/positionScale*damp*Math.sin(radian);
                        break;

                    case 3: // wavy grid
                        cubes[i][j].position.x = (15*i + j)*2;
                        cubes[i][j].position.y = (15*j + i)*2;
                        // TODO: FIX
                        cubes[i][j].position.z = 30.*tempScale[i][j]*((Math.cos(cycles/80000)*Math.sin(cycles/75000)) %.3);
                        break;

                    //case 4:
                    //    cubes[i][j].position.x = __something__;
                    //    break;

                }

                if (counter < 10 && (position+1)%4) {
                    cubes[i][j].rotation.z = 3.*degree+Math.PI/2.;
                    cubes[i][j].position.z = position%2 ? (i)*timeScale+damp : -1*i*timeScale+damp;

                } else if (counter < 20) {
                        cubes[i][j].rotation.z -= .01;
                        cubes[i][j].rotation.y += Math.abs(Math.sin(cycles/120000)%.2);
                        cubes[i][j].rotation.x += Math.abs(Math.cos(cycles/100000)%.2);

                } else if (counter < 35) {
                    cubes[i][j].rotation.y -= .01*randY;
                    cubes[i][j].rotation.x -= .01*randX;
                    cubes[i][j].rotation.z += .01;
                    debugger;

                } else if (counter < maxCycle) {
                    cubes[i][j].rotation.y += Math.sin(cycles/5000)/(maxCycle-counter);
                    cubes[i][j].rotation.x -= Math.cos(cycles/5000)/(maxCycle-counter);

                    if (counter > 40)
                        cubes[i][j].position.z = i*(50-timeScale)+damp;

                } else {
                    // counter resets after 50 seconds
                    counter = 0;
                    position++;
                    camera.lookAt(cubes[7][7].position);
                    camera.position.z += 100;
                }

                // overly complicated color assignment
                cubes[i][j].material.color.r = Math.abs(Math.sin(smoothScale+Math.log(tempScale[i][j]*(i+1))));
                cubes[i][j].material.color.g = Math.abs(Math.cos(smoothScale+Math.log(tempScale[i][j]*(i+1))));
                cubes[i][j].material.color.b = Math.abs(Math.tan(smoothScale+Math.log(tempScale[i][j]+tempScale[i][j])));

            }
        }

        if (lastScale.length>100)
            lastScale.shift();
        if (newData) {
            lastScale.push(tempScale);
            newData = false;
            console.log(triggerDetector);
            triggerDetector = 0;
        }

        cycleCount++;
    }

    // update @cycles with current execution time
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
};

//case 'fan':
/*
 * WIP
 * calls arcLength() in mathUtils.js
 * the goal here is to unravel each lotus like it were a fan
 */
//  var arc = arcLength(j, jLen, tempScale[i][j]);
//  if
//  break;
//                    /*
//                     * WIP
//                     */
//                    case 'triangle':
//                        var triLimit = triLimit || sumLimit(iLen);
//                        cubes[i][j].scale.z = (tempScale[i][j] < 1 ? 1 : tempScale[i][j]);
//                        cubes[i][j].position.y = (iLen*(i+1)+j)/2.;
//                        cubes[i][j].position.x = (i+1)*j;
//                        break;