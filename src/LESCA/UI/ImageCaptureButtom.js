import React from 'react';
import './ImageCaptureButtom.less';

import EXIF from 'exif-js';

export default class ImageCaptureButtom extends React.Component {
	constructor(props) {
		super(props);
	}
	set({ file, length = this.props.length || 500, cb }) {
		var root = this;
		var ctx = this.refs.canvas.getContext('2d');

		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			var img = new Image();
			img.onload = function () {
				let max = length,
					iw = img.width,
					ih = img.height;
				if (iw > ih) {
					if (iw > max) {
						ih = Math.round((ih *= max / iw));
						iw = max;
					}
				} else {
					if (ih > max) {
						iw = Math.round((iw *= max / ih));
						ih = max;
					}
				}
				root.refs.canvas.width = iw;
				root.refs.canvas.height = ih;
				EXIF.getData(img, (e) => {
					var o = EXIF.getTag(this, 'Orientation');
					if (o == 6 || o == 8 || o == 3) {
						var rotateAngle = 0;
						switch (o) {
							case 3:
								rotateAngle = 180;
								break;
							case 6:
								rotateAngle = 90;
								root.refs.canvas.width = ih;
								root.refs.canvas.height = iw;
								break;
							case 8:
								rotateAngle = -90;
								root.refs.canvas.width = ih;
								root.refs.canvas.height = iw;
								break;
						}
						let x = root.refs.canvas.width / 2,
							y = root.refs.canvas.height / 2;
						ctx.translate(x, y);
						ctx.rotate((rotateAngle * Math.PI) / 180);
						ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
					} else ctx.drawImage(img, 0, 0, iw, ih);
					cb(root.refs.canvas.toDataURL('image/png', 1.0));
				});
			};
			img.src = e.target.result;
		};
	}

	_capture() {
		this.refs.input.click();
	}

	_onchange(e) {
		var file = e.target.files[0];
		this.set({
			file: file,
			cb: (e) => {
				if (this.props.onend) this.props.onend(e);
			},
		});
	}

	_append() {
		if (this.props.img) return <img onClick={this._capture.bind(this)} src={this.props.img} />;
		else return <button onClick={this._capture.bind(this)}>{this.props.txt ? this.props.txt : 'Capture'}</button>;
	}

	render() {
		return (
			<div ref='main' id='lesca-imageCaptureButtom'>
				{this._append()}
				<input ref='input' onChange={this._onchange.bind(this)} type='file' accept='image/*' capture='camera' />
				<canvas ref='canvas'></canvas>
			</div>
		);
	}
}
