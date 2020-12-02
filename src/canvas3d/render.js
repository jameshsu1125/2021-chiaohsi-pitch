const EnterFrame = require('lesca').EnterFrame;
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
		let s = this.state();
		this.render = () => {
			s.begin();
			Camera.aspect = window.innerWidth / window.innerHeight;
			Camera.updateProjectionMatrix();
			Renderer.render(Scene, Camera);
			this.controls.update();
			this.particles.update(this.clock.getDelta());
			s.end();
		};
		EnterFrame.init(this.render);
		return this;
	},
	state() {
		let s = new Stats();
		s.showPanel(1);
		document.body.appendChild(s.dom);
		return s;
	},
	control() {
		this.controls = new OrbitControls(this.camera);
		this.controls.enableDamping = false;
		this.controls.dampingFactor = 0.25;
		this.controls.enabled = false;
		this.controls.enableZoom = true;
		this.zoom();
		this.pan();
	},
	appendCanvas() {
		document.getElementById('canvas3d').appendChild(this.renderer.domElement);
		document.styleSheets[0].insertRule('canvas { outline:none; border:none; }', 0);
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
	panTo({ rl = 0, tb = 0, z = 0, time = 6000 }) {
		console.log(rl);
		$(this).animate(
			{ rl: rl, z: 0, tb: tb },
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
		);
	},
};
