import React from 'react';

export default class QR extends React.Component {
	constructor(props) {
		super(props);
		const root = this;
		//scripts
	}

	componentDidMount() {
		let img = new Image();
		img.onload = (e) => {
			this.refs.img.src = e.target.src;
			if (this.props.onload) this.props.onload();
		};
		img.src = this._googleQr();
	}

	_googleQr() {
		var url = encodeURIComponent(this.props.url),
			w = this.props.width || 500,
			h = this.props.height || 500;
		return 'http://chart.apis.google.com/chart?cht=qr&chl=' + url + '&chs=' + w + 'x' + h;
	}

	render() {
		return <img ref='img' src='' width={this.props.width} height={this.props.height} />;
	}
}
