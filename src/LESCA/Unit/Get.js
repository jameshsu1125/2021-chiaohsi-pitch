module.exports = {
	get: function (t) {
		var hash = window.location.href.split('?');
		if (hash.length < 2) {
			return false;
		} else {
			var p = hash[1].split('&');
			for (var i in p) {
				var key = p[i].split('=')[0];
				if (t == key) {
					return p[i].split('=')[1];
				}
			}
			return false;
		}
	},

	remove: function (v) {
		var hash = window.location.href.split('?');
		if (hash.length < 2) {
			return false;
		} else {
			var p = hash[1].split('&');
			var op = '';
			v = v.split(' ').join('').split(',');
			var index = 0;
			for (var i in p) {
				var key = p[i].split('=')[0];
				var c = 0;
				for (var j in v) {
					if (v[j] == key) c++;
				}
				if (c == 0) {
					if (index > 0) op += '&';
					index++;
					op += p[i];
				}
			}
			return window.location.origin + window.location.pathname + (op == '' ? '' : '?') + op;
		}
	},

	removeAndGo: function (e) {
		var u = this.remove(e);
		if (!u) return;
		if (u != location.href) window.location.href = u;
	},

	root: function () {
		var u = window.location.origin + window.location.pathname;
		if (u.indexOf('.') > 0) {
			var p = u.split('/');
			p.pop();
			var op = p[0] + '//';
			for (var i = 2; i < p.length; i++) {
				op += p[i] + '/';
			}
			return op;
		}
		return u;
	},

	file: function () {
		var u = window.location.pathname;
		if (u.indexOf('.') > 0) {
			var p = u.split('/');
			return p.pop();
		}
		return 'index.html';
	},
};
