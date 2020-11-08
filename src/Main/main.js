import React from 'react';
import './main.less';
import Canvas3d from './../canvas3d/main';

export default class main extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id='main'>
				<Canvas3d />
			</div>
		);
	}
}
