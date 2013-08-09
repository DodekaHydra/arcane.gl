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

/* Lighting initialization */
var directionalLight,
    lightPosition = [ [0, 1, 1],
                      [1, 1, 0],
                      [0,-1,-1],
                      [-1,-1,0] ];

for (var lights = 0; lights < lightPosition.length; lights++){
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(lightPosition[lights][0], lightPosition[lights][1], lightPosition[lights][2]);
    scene.add(directionalLight);
}

// equations to center camera init point around cube locations
var len = cubes.length - 1.;
camera.position.x = (cubes[len][0].position.x + cubes[0][0].position.x) / 2.0;
camera.position.y = (cubes[0][len].position.y + cubes[0][0].position.y) / 2.0;
camera.position.z = cubes[0][0].position.z + 80.;
len = null;

controls = new THREE.OrbitControls(camera, $('canvas'));
controls.addEventListener('change', render);

for(var i = 0; i < 7; i++) {
    controls.pan(new THREE.Vector3( 1, 0, 0 ));
    controls.pan(new THREE.Vector3( 0, 1, 0 ));
}
//render();
//
//var source, gainNode; // terrible globals! UI.js needs these; fix later
//var array = [], boost = 0; // more terrible globals! visualizer needs these

// On song selection, load the visualizer
$('#songChoice').on('change', function(){
    var path = $('#songPath').text();
    audio(path, false, function(array, boost){
        render.array = array;
        render.boost = boost;
    });
    //render();
});


renderer.setSize($(window).width(), $(window).height());