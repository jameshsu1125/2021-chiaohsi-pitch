var THREE = require('three');
const glslify = require('glslify');
const $ = require('jquery');
const { dequeue } = require('jquery');
require('jquery-easing');

module.exports = {
	init(Scene, img) {
		this.container = new THREE.Object3D();
		this.deg = 0;
		this.radius = 0;

		const loader = new THREE.TextureLoader();
		loader.load(img, (texture) => {
			this.texture = texture;
			this.width = texture.image.width;
			this.height = texture.image.height;
			this.addPoints(img);
		});

		Scene.add(this.container);
	},
	addPoints() {
		this.numPoints = this.width * this.height;

		let numVisible = 0,
			threshold = 34;

		const img = this.texture.image;
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		canvas.width = this.width;
		canvas.height = this.height;
		ctx.scale(1, -1);
		ctx.drawImage(img, 0, 0, this.width, this.height * -1);

		this.imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		let originalColors = Float32Array.from(this.imgData.data);

		for (let i = 0; i < this.numPoints; i++) {
			if (originalColors[i * 4 + 0] > threshold) numVisible++;
		}

		this.uniforms = {
			uTime: { value: 0 },
			uRandom: { value: 0 },
			uDepth: { value: 100.0 },
			uSize: { value: 0.5 },
			uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
			uTexture: { value: this.texture },
			uTouch: { value: null },
			uPx: { value: 0.0 },
			uPy: { value: 0.0 },
		};

		const material = new THREE.RawShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: glslify(require('./shaders/particle.vert').default),
			fragmentShader: glslify(require('./shaders/particle.frag').default),
			depthTest: false,
			side: THREE.DoubleSide,
			transparent: true,
			//blending: THREE.AdditiveBlending,
		});

		var geometry = new THREE.InstancedBufferGeometry();

		const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
		positions.setXYZ(0, -0.5, 0.5, 0.0);
		positions.setXYZ(1, 0.5, 0.5, 0.0);
		positions.setXYZ(2, -0.5, -0.5, 0.0);
		positions.setXYZ(3, 0.5, -0.5, 0.0);
		geometry.setAttribute('position', positions);

		// uvs
		const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
		uvs.setXYZ(0, 0.0, 0.0);
		uvs.setXYZ(1, 1.0, 0.0);
		uvs.setXYZ(2, 0.0, 1.0);
		uvs.setXYZ(3, 1.0, 1.0);
		geometry.setAttribute('uv', uvs);
		geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

		const indices = new Uint16Array(numVisible);
		const offsets = new Float32Array(numVisible * 3);
		const angles = new Float32Array(numVisible);

		for (let i = 0, j = 0; i < this.numPoints; i++) {
			if (originalColors[i * 4 + 0] <= threshold) continue;
			offsets[j * 3 + 0] = i % this.width;
			offsets[j * 3 + 1] = Math.floor(i / this.width);
			indices[j] = i;
			angles[j] = (Math.PI / 180) * Math.random() * 360;
			j++;
		}

		geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
		geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
		geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));

		this.object3D = new THREE.Mesh(geometry, material);
		this.container.add(this.object3D);

		var resize = () => {
			this.resize();
		};
		resize();
		window.addEventListener('resize', resize);
	},
	update(delta) {
		if (this.object3D) {
			this.object3D.material.uniforms.uTime.value += delta;
			this.deg += delta;
			this.uniforms.uPx.value = Math.cos((Math.PI / 180) * this.deg) * this.radius;
			this.uniforms.uPy.value = Math.sin((Math.PI / 180) * this.deg) * this.radius;
		}
	},
	resize() {
		if (!this.object3D) return;
		const s = (window.innerWidth / window.innerHeight) * 0.8;
		this.object3D.scale.set(s, s, s);
	},
	setDepth(key, v) {
		this.uniforms[key].value = v;
	},
	updateImageData(img) {
		const loader = new THREE.TextureLoader();

		loader.load(img, (texture) => {
			this.fadeOut({
				cb: () => {
					this.uniforms.uTexture.value = texture;
					this.uniforms.uTextureSize.value = new THREE.Vector2(this.width, this.height);
					this.panDepthTo();
				},
			});
			this.fadeIn({});
		});
	},
	fadeOut({ time = 6000, radius = 200, cb = () => {} }) {
		$(this).animate(
			{ radius: radius },
			{
				duration: time,
				easing: 'easeOutQuart',
				complete: () => {
					cb();
				},
			}
		);
	},
	fadeIn({ time = 6000, radius = 0, cb = () => {} }) {
		$(this).animate(
			{ radius: radius },
			{
				duration: time,
				easing: 'easeOutQuart',
				complete: () => {
					cb();
				},
			}
		);
	},
	panDepthTo(v = 10, time = 6000) {
		$(this.uniforms.uDepth).animate(
			{
				value: v,
			},
			time,
			'easeOutQuart'
		);
	},
};
