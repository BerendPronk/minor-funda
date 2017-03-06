var app = (function() {
	var init = function(data) {
		template.render(data.pages);
		router.init(data.pages);
	};

	return {
		init: init,
		template: template,
		router: router
	}
})();

app.init(config);