const THREE = require('three');

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 500;
module.exports = camera;
