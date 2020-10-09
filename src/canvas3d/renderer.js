const THREE = require('three');

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

var resize = () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
};

//resize canvas
resize();
window.addEventListener('resize', resize);

module.exports = renderer;
