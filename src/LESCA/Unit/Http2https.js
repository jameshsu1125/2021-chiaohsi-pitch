module.exports = {
	go: function () {
		if (window.location.hostname == 'localhost') return;
		if (location.protocol != 'https:') {
			location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
		}
	},
};
