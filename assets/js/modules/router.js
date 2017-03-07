var router = (function() {
	var init = function(pagelist) {
		navigate(pagelist[0]);

		window.addEventListener('hashchange', function() {
			router.navigate(window.location.hash.replace('#', ''));
		});
	};

	var navigate = function(path) {
		var menulinks = utils.convertToArray(document.querySelectorAll('nav a'));

		var hash = '#' + path;
		window.location.hash = path;

		menulinks.map(function(anchor) {
			// Retrieves the hash part of the entire anchor-link
			var link = anchor.href.substr(anchor.href.indexOf('#'), anchor.href.length);

			if (link === hash) {
				anchor.classList.add('current');
			} else {
				anchor.classList.remove('current');
			}
		});

		show(path);
	};

	var show = function(path) {
		var sectionList = utils.convertToArray(document.querySelectorAll('body > section'));

		sectionList.map(function(section) {
			if (section.id === path) {
				section.classList.remove('hidden');
			} else {
				section.classList.add('hidden');
			}
		});
	};

	return {
		init: init,
		navigate: navigate
	};

}) ();
