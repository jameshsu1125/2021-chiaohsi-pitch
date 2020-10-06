module.exports = {
	init: function (uid, { v = 'v8.0', callback = function () {}, onStatus = function () {} }) {
		const self = this;
		this.id = uid;
		this.is = false;
		this.onStatus = onStatus;

		window.fbAsyncInit = function () {
			FB.init({
				appId: uid,
				cookie: true,
				xfbml: true,
				version: v,
			});
			self.is = true;
			callback();
			self.status();
		};
		(function (d, s, id) {
			var js,
				fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = 'https://connect.facebook.net/en_US/sdk.js';
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');
	},
	getPictureByID: function () {
		return `https://graph.facebook.com/${this.response.id}/picture?width=600&height=600`;
	},
	status: function () {
		const $ = require('jquery');
		const Hash = require('UNIT/Get');

		FB.getLoginStatus((e) => {
			this.status = e.status;

			switch (e.status) {
				case 'not_authorized':
					//console.log('未認證');
					//this.login();
					break;

				case 'connected':
					//console.log('已認證/已登入');
					FB.api('/me', { fields: 'id,name,email,picture.width(800).height(800)' }, (response) => {
						this.response = response;
						this.onStatus(response);
					});
					break;

				case 'unknown':
					//console.log('未登入');
					//this.login();
					break;
			}
		});
	},
	ready: function (id, name, token, imageURL) {
		console.log(id, name);
	},
	logout: function () {
		FB.logout((e) => {
			console.log(e);
		});
	},
	share: function ({ hashtag, redirect_uri, callback, url }) {
		var u = `https://www.facebook.com/dialog/share?app_id=${this.id}&href=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
		window.location.href = u;
	},
	click: function () {
		if (!this.is) {
			console.log('init first');
			return;
		}
		if (this.status != 'connected') this.login(window.location.href);
		else
			this.ready({
				userID: this.id,
				name: this.name,
				accessToken: this.token,
				imageUrl: this.pic,
			});
	},
	login: function (cb) {
		if (!this.is) {
			console.log('init first');
			return;
		}
		FB.login((response) => {
			if (response.authResponse) {
				FB.api('/me', { fields: 'id,name,email,picture.width(800).height(800)' }, (response2) => {
					this.response = response2;
					this.onStatus(response);
					cb(response);
				});
			} else {
				console.log('User cancelled login or did not fully authorize.');
			}
		});
	},
};
