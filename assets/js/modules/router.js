var router = {
	init: function(pagelist) {
		router.menu(pagelist);
		router.show(pagelist[0]);

		window.addEventListener('hashchange', function() {
			router.navigate(window.location.hash.replace('#', ''));
		});
	},

	menu: function(pagelist) {
		var nav = document.querySelector('nav');
		var ul = document.createElement('ul');

		pagelist.map(function(link) {
			var li = document.createElement('li');
			var anchor = document.createElement('a');

			// Early exit to prevent details-page from being rendered in the navigation
			if (link === 'detail') {
				return false;
			}

			anchor.href = '#' + link;
			if (link === 'send') {
				anchor.classList.add('current');
			}

			anchor.textContent = link;
			anchor.setAttribute('data-anchor', link);

			li.appendChild(anchor);
			ul.appendChild(li);
			nav.appendChild(ul);
		});
	},

	navigate: function(path) {
		var menulinks = utils.convertToArray(document.querySelectorAll('nav a'));

		var hash = '#' + path;
		window.location.hash = path;

		if (path === 'send') {
			// window.location.hash = 'send'
		}

		menulinks.map(function(anchor) {
			// Retrieves the hash part of the entire anchor-link
			var link = anchor.href.substr(anchor.href.indexOf('#'), anchor.href.length);

			if (link === hash) {
				anchor.classList.add('current');
			} else {
				anchor.classList.remove('current');
			}
		});

		this.show(path);
	},

	show: function(path) {
		var sectionList = utils.convertToArray(document.querySelectorAll('body > section'));

		sectionList.map(function(section) {
			if (section.id === path) {
				section.classList.remove('hidden');
			} else {
				section.classList.add('hidden');
			}
		});
	}
};