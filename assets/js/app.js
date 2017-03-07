var app = (function() {
	var init = function(data) {
		template.render.pages();
		router.init(template.navigation);
		search.init();
	};

	return {
		init: init,
		template: template,
		router: router,
		search: search
	};

})();

app.init(config);
