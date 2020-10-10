var THREE = require('three');
const glslify = require('glslify');
const $ = require('jquery');

module.exports = {
	init(Scene, img) {
		this.container = new THREE.Object3D();

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

		const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let originalColors = Float32Array.from(imgData.data);

		for (let i = 0; i < this.numPoints; i++) {
			if (originalColors[i * 4 + 0] > threshold) numVisible++;
		}

		this.uniforms = {
			uTime: { value: 0 },
			uRandom: { value: 0 },
			uDepth: { value: 40.0 },
			uSize: { value: 1.5 },
			uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
			uTexture: { value: this.texture },
			uTouch: { value: null },
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
			angles[j] = Math.random() * Math.PI;
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
		if (this.object3D) this.object3D.material.uniforms.uTime.value += delta;
	},
	resize() {
		if (!this.object3D) return;
		const scale = window.innerWidth / window.innerHeight;
		this.object3D.scale.set(scale, scale, 1);
	},
};
