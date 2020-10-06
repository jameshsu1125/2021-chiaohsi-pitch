module.exports = {
	is: function () {
		try {
			localStorage.setItem('__test', 'data');
		} catch (e) {
			return false;
		}
		return true;
	},
	set: function (key, v) {
		if (this.is()) localStorage.setItem(key, v);
		else this.err();
	},
	get: function (key) {
		if (this.is()) return localStorage.getItem(key);
		else this.err();
	},
	remove: function (key) {
		if (this.is()) return localStorage.removeItem(key);
		else this.err();
	},
	clear: function () {
		if (this.is()) localStorage.clear();
		else this.err();
	},
	err: function () {
		alert('您的瀏覽器不支援localStorage.\n請更換瀏覽器或是使用"非"無痕模式瀏覽');
	},
	showAll: function () {
		var v = [],
			k = Object.keys(localStorage),
			i = k.length;
		while (i--) v.push(localStorage.getItem(k[i]));
		console.log(localStorage);
	},
};
