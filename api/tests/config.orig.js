"use strict";

// Configuration

// This file will hold secret values and
// specific config values specific to user and environment

(function(){

	var config = {
		web: {
			port: "",
			scheme: "https://",
			api_prefix: "api/",
			host: "www.platform.local.com/"
		},
		auth: {
		}
	};

	if(typeof window === "undefined") {
		module.exports = config;
	} else { window.config = config; }

})();
