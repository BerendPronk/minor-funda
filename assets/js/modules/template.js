var template = (function() {
	// Array of data that will be used as input for the rendering of the application
	var data = [
		{
			template: 'detail',
			title: 'Over de woning'
		},
		{
			template: 'resultaten',
			title: 'Resultaten',
			noResults: 'Geen resultaten'
		},
		{
			template: 'favorieten',
			title: 'Favoriete woningen'
		}
	];

	// Stores every page-title, set as template, in an array
	var navigation = data.map(function(page) {
		return page.template;
	});

	var render = {
		// Renders content on pages
		pages: function(pagelist) {
			// Renders menu with navigation links
			render.menu(navigation);

			data.map(function(page) {
				var section = document.querySelector('#' + page.template);

				switch (page.template) {
					case 'resultaten':
						section.querySelector('h2').textContent = page.title;
						section.querySelector('#noResults').textContent = page.noResults;
					break;

					case 'kaart':
						section.querySelector('h2').textContent = page.title;
					break;

					case 'favorieten':
						section.querySelector('h2').textContent = page.title;
					break;
				}
			});
		},

		// Renders list-item for each result given in parameter
		results: function(results) {
			var resultList = document.querySelector('#results');

			utils.clearList(resultList);

			results.map(function(result) {
				var resultBlock = document.createElement('li');
				var resultContent = document.createElement('ul');

				var img = document.createElement('img');
				var address = document.createElement('h3');
				var addressLink = document.createElement('a');
				var zipCity = document.createElement('p');
				var price = document.createElement('p');
				var area = document.createElement('p');
				var added = document.createElement('span');

				var data = {
					id: result.Id,
					type: function() {
						if (result.Prijs.Koopprijs) {
							return 'koop';
						} else {
							return 'huur';
						}
					},
					img: result.FotoLarge,
					address: result.Adres,
					zipCity: result.Postcode + ', ' + result.Woonplaats,
					price: function() {
						if (result.Prijs.Koopprijs && !result.Prijs.Huurprijs) {
							return '<strong>€ ' + utils.numberWithPeriods(result.Prijs.Koopprijs) + ' <abbr title="Kosten Koper">k.k.</abbr></strong>';
						} else {
							return '<strong>€ ' + utils.numberWithPeriods(result.Prijs.Huurprijs) + ' <abbr title="Per maand">/mnd</abbr></strong>';
						}
					},
					area: function() {
						if (result.Perceeloppervlakte) {
							return result.Woonoppervlakte + 'm² / ' + result.Perceeloppervlakte + ' • ' + result.AantalKamers + ' kamers';
						} else {
							return result.Woonoppervlakte + 'm² ' + ' • ' + result.AantalKamers + ' kamers';
						}
					},
					added: result.AangebodenSindsTekst
				};

				// Sets content of new elements
				img.src = data.img;
				img.alt = 'Foto van ' + data.address;

				addressLink.setAttribute('data-id', data.id);
				addressLink.href = '#'; // Set empty link, for functionality without navigating
				addressLink.textContent = data.address;
				addressLink.addEventListener('click', function() {
					search.get.details(data.type(), data.id);
				});
				address.appendChild(addressLink);

				zipCity.textContent = data.zipCity;

				price.insertAdjacentHTML('afterbegin', data.price());

				area.textContent = data.area();

				added.insertAdjacentHTML('afterbegin', data.added);

				// Appends new elements to each result
				resultContent.appendChild(img);
				resultContent.appendChild(address);
				resultContent.appendChild(zipCity);
				resultContent.appendChild(price);
				resultContent.appendChild(area);
				resultContent.appendChild(added);

				// Appends content to list items
				resultBlock.appendChild(resultContent);
				resultList.appendChild(resultBlock);
			});
		},

		// Renders content for detail page
		detail: function(data) {
			var detailPage = document.querySelector('#detail');
			var title = detailPage.querySelector('h2');
			var subTitle = detailPage.querySelector('h3');
			var img = detailPage.querySelector('img');
			var price = detailPage.querySelector('#detailPrice');
			var desc = detailPage.querySelector('article');

			var detail = {
				price: function() {
					if (data.Koopprijs && !data.Huurprijs) {
						return '<strong>€ ' + utils.numberWithPeriods(data.Koopprijs) + ' <abbr title="Kosten Koper">k.k.</abbr></strong>';
					} else {
						return '<strong>€ ' + utils.numberWithPeriods(data.Huurprijs) + ' <abbr title="Per maand">/mnd</abbr></strong>';
					}
				},
				text: function() {
					return {
						paragraphs: data.VolledigeOmschrijving.split('\n')
					};
				}
			};

			title.textContent = data.Adres;

			subTitle.textContent = data.Postcode + ', ' + data.Plaats;

			img.src = data.HoofdFoto;
			img.alt = 'Foto van ' + data.Adres;

			price.insertAdjacentHTML('afterbegin', detail.price());

			detail.text().paragraphs.map(function(paragraph) {
				var p = document.createElement('p');
				p.textContent = paragraph;

				desc.appendChild(p);
			});

			console.log(data);
		},

		// Renders menu based on data array with content declarations
		menu: function(pagelist) {
			var nav = document.querySelector('nav');
			var ul = document.createElement('ul');

			pagelist.map(function(link) {
				var li = document.createElement('li');
				var anchor = document.createElement('a');

				// Early exit to prevent detail-page from being rendered in the navigation
				if (link === 'detail') {
					return false;
				}

				// Set empty link, for functionality without navigating
				anchor.href = '#';

				anchor.textContent = link;
				anchor.setAttribute('data-anchor', link);
				anchor.setAttribute('role', 'link');

				anchor.addEventListener('click', function() {
					router.navigate(link);
				});

				li.appendChild(anchor);
				ul.appendChild(li);
				nav.appendChild(ul);
			});
		},

		// Renders mosaic for homepage
		mosaic: function() {
			var city = '';
			utils.request('http://funda.kyrandia.nl/feeds/Aanbod.svc/json/' + config.apiKey + '/?type=koop&zo=/' + city + '/&page=' + 1 + '&pagesize=' + 24,
				function(data) {
					var results = data.Objects;
					var mosaic = document.querySelector('#mosaic');

					results.map(function(result) {
						var tile = document.createElement('li');
						var photo = document.createElement('img');

						photo.src = result.FotoMedium;

						tile.appendChild(photo);
						mosaic.appendChild(tile);
					});
				});
		}
	};

	return {
		navigation: navigation,
		render: render
	};

}) ();
