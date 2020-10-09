const THREE = require('three');

module.exports = function (coord = new THREE.Vector3(0, 0, 0)) {
	var g = new THREE.ConeBufferGeometry(1, 1, 3);
	var m = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	var c = new THREE.Mesh(g, m);
	c.position = coord;
	return c;
};
