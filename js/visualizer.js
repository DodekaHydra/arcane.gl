var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, $(window).width() / $(window).height(), 1, 1000);
var renderer = new THREE.WebGLRenderer();
var cubes = [];
var controls;

document.body.appendChild(renderer.domElement);

var i = 0;
// cube factory
for(var x = 0; x < 30; x += 2) {
    var j = 0;
    cubes[i] = [];
    for(var y = 0; y < 30; y += 2) {
        var geometry = new THREE.CubeGeometry(1.0, 1.0, 1.0);
        var material = new THREE.MeshPhongMaterial({
            ambient: 0x808080,
            specular: 0xffffff,
            shininess: 20,
            reflectivity: 5.5
        });

        cubes[i][j] = new THREE.Mesh(geometry, material);
        cubes[i][j].position = new THREE.Vector3(x, y, 0);

        scene.add(cubes[i][j]);
        j++;
    }
    i++;
}
// thru line 74 is all pretty boilerplaye
var light = new THREE.AmbientLight(0x505050);
scene.add(light);

var uniforms = {
    color: { type: "c", value: new THREE.Color( 0xffffff ) }
};

var attributes = {
    size: { type: 'f', value: [] }
};
//
//for (var q=0; q < attributes.size.value.length; q++) {
//    attributes.size.value[q] = 5 + Math.floor(Math.random() * 10);
//}

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);


directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, -1, -1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-1, -1, 0);
scene.add(directionalLight);

camera.position.z = 150;

controls = new THREE.OrbitControls(camera, $('canvas'));
controls.addEventListener('change', render);

for(var i = 0; i < 7; i++) {
    controls.pan(new THREE.Vector3( 1, 0, 0 ));
    controls.pan(new THREE.Vector3( 0, 1, 0 ));
}

// TODO: delete this
var tempcount=0;
// @last increments @counter each second
// @visual represents the starting point for the visual style
var last = 0, counter = 0, visual = 1;
var render = function (cycles) {
    // enter loop if BitArray exists and play button has been pressed
    if(typeof array === 'object' && array.length > 0 && $('#play').length === 0) {
        // increment counter each second
        if (cycles - last > 1000) {
            last = cycles;
            counter++;
        }
        // k represents an index in the bit array
        var k = 0;
        // 'circle' is the only meaningful visual at the moment
        // 'grid' works but is boring
        var styleList = ['grid', 'circle', 'fan', 'triangle'];
        var arcDeg = 360./cubes.length;

        for(var i = 0, iLen = cubes.length; i < iLen; i++) {
            for(var j = 0, jLen = cubes.length; j < jLen; j++) {
                var scale = (array[k] + boost) / 30;
                k += (k < array.length ? 1 : 0);
                switch (styleList[visual]) {
                    case 'grid':

                        cubes[i][j].scale.z = (scale < 1 ? 1 : scale);
                        cubes[i][j].material.color.r = Math.abs(Math.sin(iLen/(i+1)+Math.log(scale*(i+1))));
                        cubes[i][j].material.color.g = Math.abs(Math.cos(iLen/(i+1)+Math.log(scale*(i+1))));
                        cubes[i][j].material.color.b = Math.abs(Math.tan(iLen/(i+1)+Math.log(scale+scale)));
                        break;
                    case 'circle':
                        var degree = arcDeg*j;
                        //var radian = degree*Math.PI/180.;
                        var damp = Math.log(scale) > 0.5 ? Math.log(scale) : 0.5;
                        cubes[i][j].scale.y    = 4.0 * scale + .001;
                        cubes[i][j].scale.x    = damp;
                        cubes[i][j].scale.z    = damp;
                        cubes[i][j].position.x = 2.0*scale*Math.cos(degree) + 30.;
                        cubes[i][j].position.y = 2.0*scale*Math.sin(degree) + 30.;

                        if (counter < 6) {
                            cubes[i][j].rotation.z = degree+Math.PI/2.;
                            cubes[i][j].position.z = i*(counter+(cycles-last)/1000)+damp;
                        } else if (counter < 20) {
                            if (cubes[i][j].rotation.z != 0){
                                cubes[i][j].rotation.z -= .01;
                                //cubes[i][j].position.x += .1;
                                //cubes[i][j].position.y += .1;
                            }
                        } else if (counter < 35) {
                            cubes[i][j].rotation.y -= .01;
                            cubes[i][j].rotation.x -= .01;
                            cubes[i][j].rotation.z += .002;
                            //cubes[i][j].position.x += Math.log(cycles/10000)*Math.log(degree);
                            //cubes[i][j].position.y += .001;
                        } else if (counter < 50) {
                            cubes[i][j].rotation.y += Math.sin(cycles/5000)/(50-counter);
                            cubes[i][j].rotation.x -= Math.cos(cycles/5000)/(50-counter);

                        } else {
                            // counter resets after 50 seconds
                            counter = 0;
                            // visual is WIP. will advance case to 'fan'
//                                visual++;
                        }
                        // overly complicated color assignment
                        cubes[i][j].material.color.r = Math.abs(Math.sin(iLen/(i+1)+Math.log(scale*(i+1))));
                        cubes[i][j].material.color.g = Math.abs(Math.cos(iLen/(i+1)+Math.log(scale*(i+1))));
                        cubes[i][j].material.color.b = Math.abs(Math.tan(iLen/(i+1)+Math.log(scale+scale)));
                        break;
                    case 'fan':
                    /*
                     * WIP
                     * calls arcLength() in visFunctions.js
                     * the goal here is to unravel each lotus like it were a fan
                     */
                        var arc = arcLength(j, jLen, scale);
                        if (arc && j === 0 && tempcount < 50) {
                            console.log(arc, j);
                            tempcount++;
                        }
                        break;
                    /*
                     * WIP
                     */
                    case 'triangle':
                        var triLimit = triLimit || sumLimit(iLen);
                        cubes[i][j].scale.z = (scale < 1 ? 1 : scale);
                        cubes[i][j].position.y = (iLen*(i+1)+j)/2.;
                        cubes[i][j].position.x = (i+1)*j;
                        break;
                }
            }
        }
    }
    // update @cycles with current execution time
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
};

renderer.setSize($(window).width(), $(window).height());