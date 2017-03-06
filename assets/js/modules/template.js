// Templating
var template = {
	/*
		Template is based on following source.
		Source: Tutorial for native Javasript templating
		URL: http://codoki.com/2015/09/01/native-javascript-templating/
	*/
	data: [
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
	],

	render: function(pagelist) {
		template.data.map(function(page) {
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
	}
};