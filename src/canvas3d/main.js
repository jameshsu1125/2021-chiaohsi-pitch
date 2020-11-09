import React from 'react';
import Scene from './scene';
import Camera from './camera';
import Renderer from './renderer';
import Render from './render';
import Particles from './particles';

import Dat from 'dat.gui';
import ImageCaptureButtom from 'UI/ImageCaptureButtom';
import './main.less';

import { Howl } from 'howler';
import $ from 'jquery';

const Device = require('DEVICE/UserAgent');

export default class main extends React.Component {
	constructor(props) {
		super(props);

		let img;
		if (Device.get() == 'desktop') img = require('./img/mat.png');
		else img = require('./img/mat2.png');

		Particles.init(Scene, img);
		this.appendGUI();
	}

	appendGUI() {
		this.update = () => {
			this.refs.capture._capture();
		};
		this.keychange = function (e) {
			var key = 'u' + this.property;
			Particles.setUniforms(key, e);
		};

		this.modechange = function (e) {
			let dat = { storm: 0.0, show: 1.0, rain: 2.0, random: 3.0 };
			Particles.setUniforms('uMode', dat[e]);
		};

		var gui = new Dat.GUI();
		var p = {
			Depth: Particles.uniforms.uDepth.value,
			Size: Particles.uniforms.uSize.value,
			Alpha: 1.0,
			Radius: Particles.uniforms.uRadius.value,
			Speed: Particles.uniforms.uSpeed.value,
			Upload_image: this.update,
			Spread: this.fadeOut,
			Gather: this.fadeIn,
			Mode: 'storm',
			Reset: () => {
				Particles.addMaxTime();
			},
			BGM: () => {
				this.openSound();
			},
			ImageData_0: () => {
				this.openNewImage(0);
			},
			ImageData_1: () => {
				this.openNewImage(1);
			},
			ImageData_2: () => {
				this.openNewImage(2);
			},
			ImageData_3: () => {
				this.openNewImage(3);
			},
			ImageData_4: () => {
				this.openNewImage(4);
			},
			ImageData_5: () => {
				this.openNewImage(5);
			},
			ImageData_6: () => {
				this.openNewImage(6);
			},
		};

		gui.add(p, 'BGM');
		gui.add(p, 'Depth', 0, 200).onChange(this.keychange);
		gui.add(p, 'Size', 0.1, 3).onChange(this.keychange);
		gui.add(p, 'Alpha', 0.0, 1.0).onChange(this.keychange);
		gui.add(p, 'Radius', 0.5, 200.0).onChange(this.keychange);
		gui.add(p, 'Speed', 0.1, 1.0).onChange(this.keychange);
		gui.add(p, 'Mode', ['storm', 'show', 'rain', 'random']).onChange(this.modechange);
		gui.add(p, 'Reset');
		gui.add(p, 'Upload_image');
		gui.add(p, 'ImageData_0');
		gui.add(p, 'ImageData_1');
		// gui.add(p, 'ImageData_2');
		// gui.add(p, 'ImageData_3');
		// gui.add(p, 'ImageData_4');
		// gui.add(p, 'ImageData_5');
		// gui.add(p, 'ImageData_6');
	}

	openNewImage(v) {
		let imgs = [require('./img/1.png'), require('./img/0.png'), require('./img/01.png'), require('./img/03.png'), require('./img/04.png'), require('./img/05.png'), require('./img/06.png')][v];
		Particles.updateImageData(imgs);
	}

	openSound() {
		var c = $('.property-name'),
			t;
		c.each(function () {
			if (this.innerText == 'BGM') {
				t = this;
				this.innerText = 'BGM:loading...';
			}
		});
		var sound = new Howl({
			src: [require('./sound/bgm.mp3')],
			autoplay: true,
			onplay() {
				t.innerText = 'BGM:playing';
			},
		});
		sound.play();
	}

	componentDidMount() {
		Render.init(Scene, Camera, Renderer, Particles).appendCanvas();
	}

	onCapture(e) {
		Particles.updateImageData(e);
		//Render.panTo();
	}

	render() {
		return (
			<div id='canvas3d'>
				<ImageCaptureButtom ref='capture' onend={this.onCapture.bind(this)} />
			</div>
		);
	}
}
