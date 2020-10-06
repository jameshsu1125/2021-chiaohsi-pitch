module.exports = {
	get: function () {
		let MobileDetect = require('mobile-detect'),
			m = new MobileDetect(window.navigator.userAgent);
		this.m = m;

		/*
		 * ~'mobile-detect' medthods
		 * console.log( m.mobile() );                  // 'Sony'
		 * console.log( m.phone() );                   // 'Sony'
		 * console.log( m.tablet() );                  // null
		 * console.log( m.userAgent() );               // 'Safari'
		 * console.log( m.os() );                      // 'AndroidOS'
		 * console.log( m.is('iPhone') );              // false
		 * console.log( m.is('bot') );                 // false
		 * console.log( m.version('Webkit') );         // 534.3
		 * console.log( m.versionStr('Build') );       // '4.1.A.0.562'
		 * console.log( m.match('playstation|xbox') ); // false
		 */

		if (m.tablet()) return 'desktop';
		else if (m.mobile()) return 'mobile';
		else return 'desktop';
	},

	Wechat: {
		is: function () {
			return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
		},
	},

	Facebook: {
		is: function () {
			var ua = navigator.userAgent || navigator.vendor || window.opera;
			return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
		},
	},

	Ios: {
		is: function () {
			let MobileDetect = require('mobile-detect'),
				m = new MobileDetect(window.navigator.userAgent);
			return m.os() == 'iOS';
		},
	},

	Android: {
		is: function () {
			let MobileDetect = require('mobile-detect'),
				m = new MobileDetect(window.navigator.userAgent);
			return m.os() == 'AndroidOS';
		},
	},

	Line: {
		is: function () {
			var ua = navigator.userAgent || navigator.vendor || window.opera;
			return ua.indexOf('Line') > -1 || ua.indexOf('Line') > -1;
		},
	},
};
