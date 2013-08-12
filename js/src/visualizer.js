// @last    increments @counter each second
// @visual  starting point for the visual style
var last = 0, lastScale=[], cycleCount = 0, sceneSelector = 2, counter = 0, lastPositionScale,
    transitionTrigger = false, lastTriggerDetector, triggerFlag = false, sceneStyle = 2, transitionCounter = 0,
    randX = randomizer(5), randY = randomizer(5), randZ = randomizer(5);

var render = function (cycles) {
    var array = render.array || null;
    var boost = render.boost || 0;
    var newData = render.newData || false;
    var audioFrame = render.audioFrame || 0;
    var triggerDetector = 0;
    var incrementScene = false;
    //new THREE.Matrix4().makeRotationY(.001*randY ).multiplyVector3( camera.up );

    // enter loop if BitArray exists and play button has been pressed
    if(array && typeof array === 'object' && array.length > 0 && $('#play').length === 0) {

        // increment counter each second
        if (cycles - last > 1000) {
            last = cycles;
            counter++;
            transitionCounter++;
        }
        // 3 conditions
        if( (transitionCounter > 15) ||
            (triggerFlag && transitionCounter > 5 && transitionCounter < 15 ) ) {

            sceneStyle++;
            sceneStyle = sceneStyle%5;
            transitionCounter = 0;
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

            for(var j = 0; j < jLen; j++) {

                var timeScale = counter+(cycles-last)/1000; // ms since play()

                k += (k < array.length ? 1 : 0);

                var lastLen = lastScale.length;
                var lastFrameTween = lastLen ? lastScale[lastLen-1][i][j] : null;

                /** @frameTween : current audio data; 24 hz[==fps]
                 **   render()  : 60fps
                 **
                 ** @tempScale  :  on newData, render a point between current+previous audio frames
                 **                otherwise, render current audio frame
                 ** render() will undetectably be 1 visual frame behind the current audio */
                var frameTween = (array[k] + boost) / 30;
                tempScale[i][j] = (newData && lastFrameTween) ? (lastFrameTween+frameTween)/2 : frameTween;

                if (newData)
                    triggerDetector += tempScale[i][j];

                var smoothScale = lastFrameTween ? smoothen(tempScale[i][j], lastFrameTween) : tempScale[i][j];
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
                var positionScale = (!lastPositionScale || lastPositionScale<(timeScale+10)/(maxCycle/5.0)) ? (timeScale+10)/(maxCycle/5.0) : timeScale;
                lastPositionScale = positionScale;

                switch (sceneSelector%5){

                    case 0: // expanding cluster
                        cubes[i][j].position.x = (iLen-i+positionScale)*Math.cos(radian);
                        cubes[i][j].position.y = (iLen-i+positionScale)*Math.sin(radian);
                        break;

                    case 1: // lotus
                        cubes[i][j].position.x = (iLen-i+positionScale)*damp*Math.cos(radian);
                        cubes[i][j].position.y = (iLen-i+positionScale)*damp*Math.sin(radian);
                        break;

                    case 2: // tight cluster
                        cubes[i][j].position.x = ((iLen-i)*positionScale)/positionScale*damp*Math.cos(radian);
                        cubes[i][j].position.y = ((iLen-i)*positionScale)/positionScale*damp*Math.sin(radian);
                        break;

                    case 3: // wavy grid
                        cubes[i][j].position.x = (15*i + j)*2 - iLen*iLen/2 + damp;
                        cubes[i][j].position.y = (15*j + i)*2 - jLen*jLen/2 + damp;
                        // TODO: FIX
                        cubes[i][j].position.z = 30.*tempScale[i][j]*((Math.cos(cycles/80000)*Math.sin(cycles/75000)));
                        break;

                    case 4:
                        cubes[i][j].position.x = Math.cos(radian);
                        cubes[i][j].position.y = Math.sin(radian);
                        cubes[i][j].position.z = ((i+j)*15 - 15*7.5);
                        break;

                }

                switch (sceneStyle % 5) {
                    case 0:
                        cubes[i][j].rotation.z = 3.*degree+Math.PI/2.;
                        cubes[i][j].position.z = sceneSelector+2 % 5 || sceneSelector+1 % 5 ? (-i)+timeScale+damp : cubes[i][j].position.z;
                        break;

                    case 1:
                        cubes[i][j].rotation.z -= .01;
                        cubes[i][j].rotation.y += Math.abs(Math.sin(cycles/120000*smoothScale)%.05);
                        cubes[i][j].rotation.x += Math.abs(Math.cos(cycles/100000*smoothScale)%.05);
                        break;

                    case 2:
                        cubes[i][j].rotation.y -= .01*smoothScale;
                        cubes[i][j].rotation.x -= .01*smoothScale;
                        cubes[i][j].rotation.z += .01;
                        break;

                    case 3:
                        cubes[i][j].rotation.y += Math.sin(cycles/18000*smoothScale)/(maxCycle-counter) + .001;
                        cubes[i][j].rotation.x -= Math.cos(cycles/18000*smoothScale)/(maxCycle-counter) + .001;
                        break;

                    case 4:
                        incrementScene = true;
                        break;
                        //camera.lookAt(cubes[7][7].position);
                        //camera.position.z += 100;
                }

                if (counter > maxCycle){
                    counter = 1;
                    lastPositionScale = null;
                }
                if (counter > maxCycle-10)
                    cubes[i][j].position.z = (i+1)*(maxCycle-timeScale)+damp;


                // overly complicated color assignment
                cubes[i][j].material.color.r = Math.abs(Math.sin(counter+smoothScale+Math.log(tempScale[i][j]*(i+1))));
                cubes[i][j].material.color.g = Math.abs(Math.cos(counter-smoothScale+Math.log(tempScale[i][j]*(i+1))));
                cubes[i][j].material.color.b = Math.abs(Math.sin(counter+smoothScale)*Math.cos(tempScale[i][j]*2));

            }
        }


        if (lastScale.length>100)
            lastScale.shift();

        if (incrementScene) {
            //debugger;
            sceneStyle = 0;
            sceneSelector++;
            triggerFlag = transitionTrigger = false;

        } else if (newData) {

            triggerFlag = false;
            lastScale.push(tempScale);
            lastTriggerDetector += 20;
            triggerDetector += 20;
            if ( lastTriggerDetector &&
               ( (lastTriggerDetector *.75 > triggerDetector) || (lastTriggerDetector * 1.3333 < triggerDetector) ) ) {
                triggerFlag = true;
            }

            lastTriggerDetector = triggerDetector;

        }

        cycleCount++;
    }

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