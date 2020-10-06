module.exports = {
	Motion: {
		init: function ({ v = 20, callback }) {
			this.d = this.s = { x: 0, y: 0, z: 0 };
			this.is = true;
			this.g = v;
			this.cb = callback || this.on;
			if (typeof window.DeviceMotionEvent !== 'undefined') {
				this.f = this.call.bind(this);
				window.addEventListener('devicemotion', this.f);
				this.i = setInterval(() => {
					this.sync();
				}, 100);
			} else this.error();
		},
		call: function (e) {
			this.d = e.accelerationIncludingGravity;
		},
		sync: function () {
			if (!this.is) return;
			this.is = false;
			let c = Math.abs(this.d.x - this.s.x + this.d.y - this.s.y + this.d.z + this.s.z);
			if (c > this.g) this.cb(c);
			this.s = this.d;
			setTimeout(() => {
				this.is = true;
			}, 300);
		},
		on: function (e) {
			console.log(e);
		},
		remove: function () {
			window.removeEventListener('devicemotion', this.f);
			clearInterval(this.i);
		},
		error: function (e) {
			console.log('motion not support!');
		},
	},
	Orientation: {
		init: function ({ callback }) {
			this.cb = callback || this.on;
			this.delay = false;
			this.r = 0;
			this.is = true;
			if (window.DeviceOrientationEvent) {
				this.f = this.call.bind(this);
				window.addEventListener('deviceorientation', this.f);
			} else this.error();
		},
		call: function (e) {
			if (!this.is) return;
			var d, t, h;
			if (typeof e.webkitCompassHeading !== 'undefined') {
				d = e.webkitCompassHeading;
				if (typeof window.orientation !== 'undefined') d += window.orientation;
			} else {
				d = 360 - e.alpha;
			}
			t = Math.round(d) - this.r;
			h = Math.round(d);
			var g, b, a;
			g = Math.round(e.gamma);
			b = Math.round(e.beta);
			a = h;
			if (this.delay) this.cb(g, b, a);
			setTimeout(
				function () {
					this.delay = true;
				}.bind(this),
				200
			);
		},
		error: function () {
			console.log('orientation not support!');
		},
		on: function (LR, FB, Dir) {
			console.log(LR, FB, Dir);
		},
		remove: function () {
			window.removeEventListener('deviceorientation', this.f);
		},
	},
	OrientationChange: {
		init: function ({ callback }) {
			this.cb = callback || this.on;
			if (window.DeviceOrientationEvent) {
				this.f = this.call.bind(this);
				this.f();
				window.addEventListener('orientationchange', this.f);
			} else this.error();
		},
		call: function (e) {
			var angle;
			if (window.orientation != undefined) angle = window.orientation;
			else angle = screen.orientation.angle;
			this.cb(angle);
		},
		error: function () {
			console.log('orientationchnage not support!');
		},
		on: function (ang) {
			console.log(ang);
		},
	},
};
