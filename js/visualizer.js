var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, $(window).width() / $(window).height(), 1, 1000);
var renderer = new THREE.WebGLRenderer();
var cubes = [];
var controls;

document.body.appendChild(renderer.domElement);

var i = 0;
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

var light = new THREE.AmbientLight(0x505050);
scene.add(light);

var uniforms = {
    color: { type: "c", value: new THREE.Color( 0xffffff ) }
};

var attributes = {
    size: { type: 'f', value: [] }
};

for (var q=0; q < attributes.size.value.length; q++) {
    attributes.size.value[q] = 5 + Math.floor(Math.random() * 10);
}

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

camera.position.z = 50;

controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

for(var i = 0; i < 7; i++) {
    controls.pan(new THREE.Vector3( 1, 0, 0 ));
    controls.pan(new THREE.Vector3( 0, 1, 0 ));
}

var last = 0, counter = 0, triLimit;
var render = function (cycles) {
    if (cycles - last > 1000) {
        last = cycles;
        counter++;
    }
    if(typeof array === 'object' && array.length > 0) {
        var k = 0;
        var styleList = ['grid', 'circle', 'triangle'];
        var style = styleList[1];
        var arcDeg = 360./cubes.length;
            for(var i = 0, iLen = cubes.length; i < iLen; i++) {
                for(var j = 0, jLen = cubes.length; j < jLen; j++) {
                    var scale = (array[k] + boost) / 30;
                    k += (k < array.length ? 1 : 0);
//                    debugger;
                    switch (style) {
                        case 'grid':

                            cubes[i][j].scale.z = (scale < 1 ? 1 : scale);
                            cubes[i][j].material.color.r = Math.abs(Math.sin(iLen/(i+1)+Math.log(scale*(i+1))));
                            cubes[i][j].material.color.g = Math.abs(Math.cos(iLen/(i+1)+Math.log(scale*(i+1))));
                            cubes[i][j].material.color.b = Math.abs(Math.tan(iLen/(i+1)+Math.log(scale+scale)));
                            break;
                        case 'circle':
                            var degree = arcDeg*j;
                            //var radian = degree*Math.PI/180.;
                            var damp = Math.log(Math.log(scale)) > 0.75 ? Math.log(Math.log(scale)) : 0.5;
                            cubes[i][j].scale.y    = 1.5 * scale + .001;
                            cubes[i][j].scale.x    = damp;
                            cubes[i][j].scale.z    = damp;
                            cubes[i][j].position.x = scale*Math.cos(degree) + 12.;
                            cubes[i][j].position.y = scale*Math.sin(degree) + 12. ;
                            cubes[i][j].position.z = i*4.+damp;

                            if (counter < 10) {
                                cubes[i][j].rotation.z = degree+Math.PI/2.;
                            } else if (counter < 20) {
                                if (cubes[i][j].rotation.z != 0){
                                    cubes[i][j].rotation.z -= .01;
                                    cubes[i][j].position.x += .1;
                                    cubes[i][j].position.y += .1;
                                }
                                //cubes[i][j].rotation.z = radian;
                            } else if (counter < 35) {
                                cubes[i][j].rotation.y += .01;
                                cubes[i][j].rotation.x -= .01;
                                cubes[i][j].rotation.z += .002;
                                cubes[i][j].position.x += Math.log(cycles/10000)*Math.log(degree);
                                cubes[i][j].position.y += .001;
                            } else if (counter < 50) {
                                cubes[i][j].rotation.y = Math.sin(cycles/5000);
                                cubes[i][j].rotation.x = Math.cos(cycles/5000);

                            } else {
                                counter = 0;

                            }

//                            if (false) {
//                                fanDegree = (cubes.length * (j+1))/360.;
//                                cubes[i][j].scale.y 	= 1.5 * scale + .001;
//                                cubes[i][j].rotation.z = fanDegree+Math.PI/2;
//                                cubes[i][j].position.x = Math.cos(fanDegree);
//                                cubes[i][j].position.y = Math.sin(fanDegree);
//                                cubes[i][j].position.z = Math.sin(i/(cubes.length/2))*10.+2.;
//                            }
                            cubes[i][j].material.color.r = Math.abs(Math.sin(iLen/(i+1)+Math.log(scale*(i+1))));
                            cubes[i][j].material.color.g = Math.abs(Math.cos(iLen/(i+1)+Math.log(scale*(i+1))));
                            cubes[i][j].material.color.b = Math.abs(Math.tan(iLen/(i+1)+Math.log(scale+scale)));
                            break;
                        case 'triangle':
                            triLimit = triLimit ? triLimit : sumLimit(iLen);
                            cubes[i][j].scale.z = (scale < 1 ? 1 : scale);
                            cubes[i][j].position.y = (iLen*(i+1)+j)/2.;
                            cubes[i][j].position.x = (i+1)*j;
                            break;
                    }
                }
            }

    }

    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
};


// on song selection, load the visualizer
//$('#songChoice').on('change', function(){
    //var test = Audio($('#songPath').text());
    //console.log(test);
    render(0);
//});
renderer.setSize($(window).width(), $(window).height());
