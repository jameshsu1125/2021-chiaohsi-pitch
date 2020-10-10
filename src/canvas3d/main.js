import React from 'react';
import Scene from './scene';
import Camera from './camera';
import Renderer from './renderer';
import Render from './render';
import WorldCoord from './worldCoord';
import Particles from './particles';

import Dat from 'dat.gui';

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

		var gui = new Dat.GUI();
		var p = { center: false };
		gui.add(p, 'center').onChange((e) => {
			if (e) Scene.add(w);
			else Scene.remove(w);
		});
	}

	componentDidMount() {
		Render.init(Scene, Camera, Renderer, Particles).appendCanvas();
	}

	render() {
		return <div id='canvas3d'></div>;
	}
}
