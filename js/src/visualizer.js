// @last    increments @counter each second
// @visual  starting point for the visual style
var last = 0, counter = 0, visual = 0, lastScale=[];
var render = function (cycles) {
    var array = render.array || null;
    var boost = render.boost || 0;
    // enter loop if BitArray exists and play button has been pressed
    if(array && typeof array === 'object' && array.length > 0 && $('#play').length === 0) {
        // increment counter each second
        if (cycles - last > 1000) {
            last = cycles;
            counter++;
        }
        // k represents an index in the bit array
        var k = 0;
        // 'circle' is the only meaningful visual at the moment
        // 'grid' works but is boring
        var styleList = ['circle', 'fan', 'triangle'],
            iLen = cubes.length, jLen = cubes[0].length,
            arcDeg = 360./iLen, maxCycle = 50,
            lotusSize = [], tempScale = [],
            rand9 = randomizer(9), rand4 = randomizer(4), randX = randomizer(5), randY = randomizer(5);
        /*
         * @lastScale = previous fully completed data sequence of frequency data
         * @tempScale = current scale sequence
         */
        for(var i = 0; i < iLen; i++) {
            tempScale[i] = [];
            lastScale[i] = lastScale[i] || [];
            for(var j = 0; j < jLen; j++) {
                tempScale[i][j] = (array[k] + boost) / 30;
                k += (k < array.length ? 1 : 0);
                var smoothScale = lastScale[lastScale.length-1].length ? lastScale[lastScale.length-1][i][j] - tempScale[i][j] : tempScale[i][j];
                    smoothScale = smoothScale >  1  ? Math.pow(smoothScale, 2/3) :
                                  smoothScale >= 0  ? smoothScale :
                               /* smoothScale <  0 */ -1.0*Math.pow(Math.abs(smoothScale), 2/3);
                var timeScale = counter+(cycles-last)/1000; // ms since play()
                switch (styleList[visual]) {
                    case 'circle':
                        var degree = arcDeg*j;
                        //var radian = degree*Math.PI/180.;
                        var damp = Math.log(tempScale[i][j]*tempScale[i][j]) > 0.5 ? Math.log(tempScale[i][j]*tempScale[i][j]) : 0.5;
                        cubes[i][j].scale.y    = 2.0*tempScale[i][j] + .001;
                        cubes[i][j].scale.x    = damp;
                        cubes[i][j].scale.z    = damp;
                        /*
                         * Range of timeScale+10 = 10-60
                         * maxCycle/5.           = 10
                         * pos.x and pos.y scale over time by an increasing factor from 1-5;
                         */
                        var positionScale = (timeScale+10)/(maxCycle/5.);

                        cubes[i][j].position.x = ((iLen-i+positionScale)/positionScale)*damp*Math.cos(degree);
                        cubes[i][j].position.y = ((iLen-i+positionScale)/positionScale)*damp*Math.sin(degree);

                        if (counter < 10) {
                            cubes[i][j].rotation.z = 3.*degree+Math.PI/2.;
                            cubes[i][j].position.z = (i)*timeScale+damp;
                        } else if (counter > 20) {
                                cubes[i][j].rotation.z -= .01;
                        } else if (counter < 35) {
                            cubes[i][j].rotation.y -= .01*randY;
                            cubes[i][j].rotation.x -= .01*randX;
                            cubes[i][j].rotation.z += .002;
                        } else if (counter < maxCycle) {
                            cubes[i][j].rotation.y += Math.sin(cycles/5000)/(maxCycle-counter);
                            cubes[i][j].rotation.x -= Math.cos(cycles/5000)/(maxCycle-counter);
                            if (counter > 40)
                                cubes[i][j].position.z = i*(50-timeScale)+damp;
                        } else {
                            // counter resets after 50 seconds
                            counter = 0;
                            // visual is WIP. will advance case to 'fan'
//                                visual++;
                        }
                        // overly complicated color assignment
                        cubes[i][j].material.color.r = Math.abs(Math.sin(iLen/(i+1)+Math.log(tempScale[i][j]*(i+1))));
                        cubes[i][j].material.color.g = Math.abs(Math.cos(iLen/(i+1)+Math.log(tempScale[i][j]*(i+1))));
                        cubes[i][j].material.color.b = Math.abs(Math.tan(iLen/(i+1)+Math.log(tempScale[i][j]+tempScale[i][j])));
                        break;
//                    case 'fan':
//                    /*
//                     * WIP
//                     * calls arcLength() in mathUtils.js
//                     * the goal here is to unravel each lotus like it were a fan
//                     */
//                        var arc = arcLength(j, jLen, tempScale[i][j]);
//                        if (arc && j === 0 && tempcount < 50) {
//                            console.log(arc, j);
//                            tempcount++;
//                        }
//                        break;
//                    /*
//                     * WIP
//                     */
//                    case 'triangle':
//                        var triLimit = triLimit || sumLimit(iLen);
//                        cubes[i][j].scale.z = (tempScale[i][j] < 1 ? 1 : tempScale[i][j]);
//                        cubes[i][j].position.y = (iLen*(i+1)+j)/2.;
//                        cubes[i][j].position.x = (i+1)*j;
//                        break;
                }
            }
        }

        if (lastScale.length>100) lastScale.shift();
        lastScale.push(tempScale);
    }
    // update @cycles with current execution time
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
};
