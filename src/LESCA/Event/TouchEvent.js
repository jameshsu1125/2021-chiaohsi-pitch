module.exports = {
	db: {},
	init: function () {
		this.fn = function (e) {
			if (e.cancelable) if (!e.defaultPrevented) if (e.target.localName != 'input' && e.target.localName != 'button') e.preventDefault();
			this.get(e.target);
		}.bind(this);
		document.addEventListener('touchstart', this.fn, {
			passive: false,
			capture: false,
		});
	},
	get: function (e) {
		if (!this.db[e.id]) return;
		this.db[e.id](e);
	},
	add: function (
		id = 'ID',
		fn = function () {
			console.log('cb');
		}
	) {
		this.db[id] = fn;
	},
	remove: function (id = 'ID') {
		delete this.db[id];
	},
	clear: function () {
		this.db = {};
	},
	destory: function () {
		document.removeEventListener('touchstart', this.fn);
	},
};
