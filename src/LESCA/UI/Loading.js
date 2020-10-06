import React from 'react';
import './Loading.less';
import $ from 'jquery';

export default class Loading extends React.Component {
	constructor(props) {
		super(props);
		this.r = 0;
	}

	componentDidMount() {
		this.frame = setInterval(() => {
			this.rotation($(this.refs.c), this.r++);
		}, 100);
	}

	rotation(e, s) {
		e.css({
			transform: `rotate(${s * 20}deg)`,
			'-webkit-transform': `rotate(${s * 20}deg)`,
			'-moz-transform': `rotate(${s * 20}deg)`,
			'-o-transform': `rotate(${s * 20})`,
			'-ms-transform': `rotate(${s * 20}deg)`,
		});
	}

	componentWillUnmount() {
		clearInterval(this.frame);
	}

	appendLinesClass() {
		var style = this.props.style ? ` ${this.props.style}` : ' dark';
		return 'l' + style;
	}

	appendLines() {
		var op = [];
		for (var i = 0; i < 18; i++) {
			op.push(<div key={i} className={this.appendLinesClass()}></div>);
		}
		return op;
	}

	appendBackgroundClass() {
		var style = this.props.style ? ` ${this.props.style}` : ' dark';
		return 'lesca-loading-bg' + style;
	}

	appendTextClass() {
		var style = this.props.style ? ` t${this.props.style}` : ' tdark';
		return 'lesca-loading-text' + style;
	}

	appendText() {
		if (this.props.text) return <div className={this.appendTextClass()}>{this.props.text}</div>;
	}

	render() {
		return (
			<div id='lesca-loading'>
				<div className={this.appendBackgroundClass()}></div>
				<div ref='c' className='lesca-loading-c'>
					{this.appendLines()}
				</div>
				{this.appendText()}
			</div>
		);
	}
}
