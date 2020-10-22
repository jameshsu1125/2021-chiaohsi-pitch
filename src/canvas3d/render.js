const EnterFrame = require('UNIT/EnterFrame');
const THREE = require('three');
const OrbitControls = require('./Orbit')(THREE);
const Stats = require('stats-js');
const $ = require('jquery');
require('jquery-easing');

module.exports = {
	init(Scene, Camera, Renderer, Particles) {
		this.tb = 90;
		this.rl = 0;
		this.z = 500;

		this.renderer = Renderer;
		this.particles = Particles;
		this.camera = Camera;
		this.clock = new THREE.Clock(true);

		this.control();

		var stats = new Stats();
		stats.showPanel(1);
		document.body.appendChild(stats.dom);

		this.render = () => {
			stats.begin();
			Camera.aspect = window.innerWidth / window.innerHeight;
			Camera.updateProjectionMatrix();
			Renderer.render(Scene, Camera);
			this.controls.update();
			this.particles.update(this.clock.getDelta());
			stats.end();
		};
		EnterFrame.init(this.render);
		return this;
	},
	control() {
		this.controls = new OrbitControls(this.camera);
		this.controls.enableDamping = false;
		this.controls.dampingFactor = 0.25;
		this.controls.enabled = true;
		this.controls.enableZoom = true;
		this.zoom();
		this.pan();
	},
	appendCanvas() {
		document.getElementById('canvas3d').appendChild(this.renderer.domElement);
		document.styleSheets[0].insertRule(
			'canvas { outline:none; border:none; }',
			0
		);
	},
	zoom() {
		this.controls.zoom(this.z);
	},
	pan() {
		this.controls.setAzimuthalAngle((Math.PI / 180) * this.rl);
	},
	pol() {
		this.controls.setPolarAngle((Math.PI / 180) * (90 + this.rl));
	},
	panTo(v = 1080, time = 6000) {
		$(this)
			.animate(
				{ rl: v, z: 0, rl: 0 },
				{
					duration: time,
					step: () => {
						this.pan();
						this.pol();
						this.zoom();
					},
					complete: () => {
						this.pan();
						this.pol();
						this.zoom();
					},
					easing: 'easeInQuart',
				}
			)
			.animate(
				{ rl: 0, z: 500, rl: 0 },
				{
					duration: time,
					step: () => {
						this.pan();
						this.pol();
						this.zoom();
					},
					complete: () => {
						this.pan();
						this.pol();
						this.zoom();
					},
					easing: 'easeOutQuart',
				}
			);
	},
};
