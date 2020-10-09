var THREE = require('three');
const glslify = require('glslify');

module.exports = {
	init: function (Scene, img) {
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
	addPoints: function (discard = true) {
		this.numPoints = this.width * this.height;

		let numVisible = this.numPoints;
		let threshold = 0;
		let originalColors;
		if (discard) {
			numVisible = 0;
			threshold = 34;

			const img = this.texture.image;
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			canvas.width = this.width;
			canvas.height = this.height;
			ctx.scale(1, -1);
			ctx.drawImage(img, 0, 0, this.width, this.height * -1);

			const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			originalColors = Float32Array.from(imgData.data);

			for (let i = 0; i < this.numPoints; i++) {
				if (originalColors[i * 4 + 0] > threshold) numVisible++;
			}
		}

		const uniforms = {
			uTime: { value: 0 },
			uRandom: { value: 1.0 },
			uDepth: { value: 2.0 },
			uSize: { value: 0.0 },
			uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
			uTexture: { value: this.texture },
			uTouch: { value: null },
		};

		const material = new THREE.RawShaderMaterial({
			uniforms,
			vertexShader: glslify(require('./shaders/particle.vert')),
			fragmentShader: glslify(require('./shaders/particle.frag')),
			depthTest: false,
			side: THREE.DoubleSide,
			transparent: true,
			// blending: THREE.AdditiveBlending
		});

		var geometry = new THREE.BufferGeometry();

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
			if (discard && originalColors[i * 4 + 0] <= threshold) continue;
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
	},
	update(delta) {
		if (this.object3D) {
			this.object3D.material.uniforms.uTime.value += delta;
			//this.object3D.material.uniforms.time.value += delta;
		}
	},
};
