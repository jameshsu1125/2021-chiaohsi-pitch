import React from 'react';
import Scene from './scene';
import Camera from './camera';
import Renderer from './renderer';
import Render from './render';
import WorldCoord from './worldCoord';
import Particles from './particles';

import Dat from 'dat.gui';
import ImageCaptureButtom from 'UI/ImageCaptureButtom';

import './main.less';

export default class main extends React.Component {
	constructor(props) {
		super(props);

		var img = require('./img/S__21594114.jpg');
		Particles.init(Scene, img);

		this.appendGUI();
	}

	appendGUI() {
		var w = new WorldCoord();

		this.update = () => {
			this.refs.capture._capture();
		};
		this.keychange = function (e) {
			var key = 'u' + this.property;
			Particles.setDepth(key, e);
		};

		this.fadeOut = () => {
			Particles.fadeOut({});
		};

		this.fadeIn = () => {
			Particles.fadeIn({});
		};

		this.panTo = () => {
			Render.panTo();
		};

		var gui = new Dat.GUI();
		var p = {
			center: false,
			Depth: Particles.uDepth,
			Random: 0,
			Size: 0.5,
			addImageData: this.update,
			Spread: this.fadeOut,
			Gather: this.fadeIn,
			panTo: this.panTo,
		};

		gui.add(p, 'Depth', 0, 200).onChange(this.keychange);
		//gui.add(p, 'Random', -100, 100).onChange(this.keychange);
		gui.add(p, 'Size', 0.1, 3).onChange(this.keychange);
		gui.add(p, 'Spread');
		gui.add(p, 'Gather');
		gui.add(p, 'addImageData');
		//gui.add(p, 'panTo');
	}

	componentDidMount() {
		Render.init(Scene, Camera, Renderer, Particles).appendCanvas();
	}

	onCapture(e) {
		Particles.updateImageData(e);
		Render.panTo();
	}

	render() {
		return (
			<div id='canvas3d'>
				<ImageCaptureButtom ref='capture' onend={this.onCapture.bind(this)} />
			</div>
		);
	}
}
