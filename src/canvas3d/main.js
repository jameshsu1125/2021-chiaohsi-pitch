import React from 'react';
import Scene from './scene';
import Camera from './camera';
import Renderer from './renderer';
import Render from './render';
import Particles from './particles';

import Dat from 'dat.gui';
import ImageCaptureButtom from 'UI/ImageCaptureButtom';
import './main.less';

export default class main extends React.Component {
	constructor(props) {
		super(props);

		var img = require('./img/mat.png');
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
			Radius: 200,
			Speed: Particles.uniforms.uSpeed.value,
			addImageData: this.update,
			Spread: this.fadeOut,
			Gather: this.fadeIn,
			Mode: 'storm',
			Release: () => {
				Particles.addMaxTime();
			},
		};

		gui.add(p, 'Depth', 0, 200).onChange(this.keychange);
		gui.add(p, 'Size', 0.1, 3).onChange(this.keychange);
		gui.add(p, 'Alpha', 0.0, 1.0).onChange(this.keychange);
		gui.add(p, 'Radius', 0.5, 200.0).onChange(this.keychange);
		gui.add(p, 'Speed', 0.1, 1.0).onChange(this.keychange);
		gui.add(p, 'Mode', ['storm', 'show', 'rain', 'random']).onChange(this.modechange);
		gui.add(p, 'Release');
		gui.add(p, 'addImageData');
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
