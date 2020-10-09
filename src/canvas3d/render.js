var EnterFrame = require('UNIT/EnterFrame');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
var Stats = require('stats-js');

module.exports = {
	init: function (Scene, Camera, Renderer, Particles) {
		const controls = new OrbitControls(Camera);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		//controls.enableZoom = false;

		this.renderer = Renderer;
		this.particles = Particles;

		this.clock = new THREE.Clock(true);

		var stats = new Stats();
		stats.showPanel(1);
		document.body.appendChild(stats.dom);

		this.render = () => {
			stats.begin();
			Camera.aspect = window.innerWidth / window.innerHeight;
			Camera.updateProjectionMatrix();
			Renderer.render(Scene, Camera);
			controls.update();
			this.particles.update(this.clock.getDelta());
			stats.end();
		};
		EnterFrame.init(this.render);
		return this;
	},
	appendCanvas: function () {
		document.getElementById('canvas3d').appendChild(this.renderer.domElement);
		document.styleSheets[0].insertRule('canvas { outline:none; border:none; }', 0);
	},
};
