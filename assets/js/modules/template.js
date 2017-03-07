var template = (function() {
	var data = [
		{
			template: 'one',
			title: 'HOMEPAGE'
		},
		{
			template: 'two',
			title: 'PAGINA 2'
		},
		{
			template: 'three',
			title: 'PAGINA 3'
		}
	];

	var navigation = data.map(function(page) {
		return page.template;
	});

	var render = {
		pages: function(pagelist) {
			render.menu(navigation);
			render.mosaic(navigation);

			data.map(function(page) {
				var section = document.querySelector('#' + page.template);

				switch (page.template) {
					case 'one':
						section.querySelector('h2').textContent = page.title;
					break;

					case 'two':
						section.querySelector('h2').textContent = page.title;
					break;

					case 'three':
						section.querySelector('h2').textContent = page.title;
					break;
				}
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

		mosaic: function() {
			console.log('render mosaic!');
		}
	};

	return {
		navigation: navigation,
		render: render
	};

}) ();
