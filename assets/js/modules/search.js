var search = (function() {
	var init = function() {
		form.search.addEventListener('input', get.suggestions);
		form.search.addEventListener('keyup', function(e) {
			// Sets input if user pressed return
			if (e.keyCode === 13) {
				setInput(form.search.value);
			}
		});

		// Hides suggestionbox and advanced filter on initialization
		form.suggestions.classList.add('hidden');
		form.filterAdvanced.classList.add('hidden');

		// Toggles advanced filter
		form.filterToggle.addEventListener('click', function() {
			if (form.filterToggle.checked) {
				form.filterAdvanced.classList.remove('hidden');
				form.suggestions.classList.add('hidden');
			} else {
				form.filterAdvanced.classList.add('hidden');
			}
		});

		// Adds periods to price-filter input
		utils.convertToArray(form.filterPrice).map(function(input) {
			input.addEventListener('input', function() {
				utils.setPeriods(input, event.target.value);
			});
		});

		form.submit.addEventListener('click', function() {
			form.suggestions.classList.add('hidden');
			form.filterAdvanced.classList.add('hidden');
			get.results();
		});
	};

	var form = {
		search: document.querySelector('header form [type="text"]'),
		suggestions: document.querySelector('header form #suggestions'),
		filterToggle: document.querySelector('header form #filterToggle'),
		filterAdvanced: document.querySelector('header form .filter-advanced'),
		filterPrice: document.querySelectorAll('header form .filter-text [type="number"]'),
		filters: {
			type: {
				buy: document.querySelector('header form #filterTypeBuy'),
				rent: document.querySelector('header form #filterTypeRent')
			}
		},
		submit: document.querySelector('header form #submit')
	};

	// Set selected suggestion and removes suggestion list
	var setInput = function(value) {
		form.search.value = value;

		utils.clearList(form.suggestions);
		form.suggestions.classList.add('hidden');
		form.filterAdvanced.classList.add('hidden');
	};

	var get = {
		// JSONP request for suggestion on current input
		suggestions: function() {
			utils.JSONP.send('http://zb.funda.info/frontend/geo/suggest/?query=/' + this.value + '/&max=5&type=koop&callback=callback', {
				onSuccess: function(data) {
					var results = data.Results;

					// Clears suggestion list with every keystroke
					utils.clearList(suggestions);

					// Hides list if there aren't any results
					if (results.length === 0) {
						form.suggestions.classList.add('hidden');
						return false;
					}

					// Removes location without houses
					var filteredResults = results.filter(function(result) {
						return result.Aantal > 0;
					});

					// Creates a list-item for each suggestion result
					filteredResults.map(function(result) {
						var suggestion = document.createElement('li');
						var suggestionBlock = document.createElement('ul');
						var location = document.createElement('li');
						var amount = document.createElement('li');

						location.textContent = result.Display.Naam;
						location.insertAdjacentHTML('beforeend', '<span>' + result.Display.NiveauLabel + '</span>');

						amount.textContent = result.Aantal;
						amount.insertAdjacentHTML('beforeend', '<img src="./assets/img/house.png" alt="huizen">');

						suggestionBlock.appendChild(location);
						suggestionBlock.appendChild(amount);

						suggestion.appendChild(suggestionBlock);
						suggestion.addEventListener('click', function() {
							setInput(result.Display.Naam);
							get.results(result.GeoIdentifier);
						});

						form.suggestions.appendChild(suggestion);
						form.suggestions.classList.remove('hidden');
					});

				},
				onTimeout: function() {
					console.warn('Search suggestions has timed out!');
				},
				timeout: 5000 // five second timeout for callback
			});
		},

		// Fetch promise requesting input from API
		results: function(value) {
			event.preventDefault();

			// Checks if input came from suggestion, replaces spaces with dashes if not
			var input = function() {
				if (typeof value === 'string') {
					return value;
				} else {
					return form.search.value.replace(/ /g, '-');
				}
			};

			var getType = function() {
				if (form.filters.type.buy.checked) {
					return 'koop';
				} else {
					return 'huur';
				}
			};

			// Early exit if input is empty
			if (input() === '') {
				return false;
			}

			utils.request('http://funda.kyrandia.nl/feeds/Aanbod.svc/json/' + config.apiKey + '/?type=' + getType() + '&zo=/' + input() + '/&page=' + 1 + '&pagesize=' + 25,
				function(data) {
					var noResults = document.querySelector('#noResults');
					var results = filter.by(data.Objects, filter.get());

					// hides splashscreen
					utils.splashScreen(false);

					// Provides user with feedback, clears result feedback when there are no results
					if (results.length === 0) {
						var resultAmount = document.querySelector('#resultAmount');
						resultAmount.innerHTML = '';

						// Hides empty result message
						noResults.classList.remove('hidden');

						utils.feedback('Geen resultaten', 'negative');

						return false;

					} else if (results.length === 1) {
						utils.feedback('1 resultaat', 'positive');
					} else {
						utils.feedback(results.length + ' resultaten', 'positive');
					}

					// Sets content of the result counter and removes no-results message
					get.resultAmount(input());
					noResults.classList.add('hidden');

					// Renders a list-item for each result
					template.render.result('#results', results);

					router.navigate('resultaten');
				});
		},

		// Provides user with feedback on the amount of results
		resultAmount: function(query) {
			utils.JSONP.send('http://zb.funda.info/frontend/geo/suggest/?query=/' + query + '/&max=1&type=koop&callback=callback', {
				onSuccess: function(data) {
					var results = document.querySelectorAll('#results > li');
					var resultAmount = document.querySelector('#resultAmount');

					resultAmount.innerHTML = '';

					if (data.Results.length > 0) {
						resultAmount.insertAdjacentHTML('afterbegin', '<span>' + results.length + '</span> van ' + data.Results[0].Aantal + ' totaal')
					} else {
						return false;
					}
				},
				onTimeout: function() {
					console.warn('Result-amount request has timed out!');
				},
				timeout: 5000 // five second timeout for callback
			});
		},

		// Requests information on detail page and renders it
		details: function(type, id) {
			utils.request('http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/' + config.apiKey + '/' + type + '/' + id + '/',
				function(data) {
					template.render.detail(data);

					router.navigate('detail');
				});
		},

		// Requests information for each item in favorites
		favorites: function(type, favorites) {
			var favoritesList = document.querySelector('#favorites');
			// Hides empty favorites message
			var noFavorites = document.querySelector('#noFavorites');
			noFavorites.classList.add('hidden');

			// Clears favorites before adding a new list
			utils.clearList(favoritesList);

			favorites.map(function(id, index) {
				utils.request('http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/' + config.apiKey + '/' + type[index] + '/' + id + '/',
					function(data) {
						// Stores data in array for the render function to loop through
						var results = [data];

						template.render.result('#favorites', results);
					});
			})
		},

		// Renders breadcrumb for detail page
		breadCrumbs: function(from, current) {
			var breadCrumbs = document.querySelector('#breadcrumbs');
			var breadCrumbList = [from, current];

			utils.clearList(breadCrumbs);
			breadCrumbList.map(function(crumb, index) {
				var newCrumb = document.createElement('li');
				var anchor = document.createElement('a');

				if (index !== breadCrumbList.length - 1) {
					anchor.textContent = crumb;
					anchor.href = "#";
					anchor.addEventListener('click', function() {
						router.navigate(crumb);
					});

					newCrumb.appendChild(anchor);
				} else {
					newCrumb.textContent = crumb;
				}

				breadCrumbs.appendChild(newCrumb);
			});
		}
	};

	// Filters data based on user input
	var filter = {
		// Get active filters
		get: function() {
			var filters = {};
			var filterOpts = ['filterPriceFrom', 'filterPriceTo'];

			filterOpts.map(function(option) {
				var filterTag = document.querySelector('#' + option);
				var filterType = filterTag.getAttribute('type');
				var filterName = filter.convert(option);

				// Set value of property based on input filter type
				if (filterType == 'text' || filterType == 'number') {
					if (filterTag.value) {
						filters[filterName] = filterTag.value
					}
				} else {
					filters[filterName] = filterTag.checked
				}
			});

			console.log(filters);

			if (filter.length === 0) {
				return false;
			}
			else {
				return filters;
			}
		},

		by: function(inputData, filters) {
			// Return input data if no filters are applied
			if (filter.count(filters) === 0) {
				return inputData;
			}

			var outputData = function() {
				var tempData = inputData;

				if (filters.prijsVan) {
					tempData = tempData.filter(function(object) {
						if (object.Koopprijs && !object.Huurprijs) {
							return object.Koopprijs > filters.prijsVan;
						} else {
							return object.Huurprijs > filters.prijsVan;
						}
					});
				}
				if (filters.prijsTot) {
					tempData = tempData.filter(function(object) {
						if (object.Koopprijs && !object.Huurprijs) {
							return object.Koopprijs < filters.prijsTot;
						} else {
							return object.Huurprijs < filters.prijsTot;
						}
					});
				}

				return tempData;
			}

			return outputData();
		},

		// Counts properties of filter object
		count: function(filters) {
			var index = 0;

			for (var key in filters) {
				index++;
			}

			return index;
		},

		// Library that converts element ID's to filter properties
		convert: function(id) {
			switch (id) {
				case 'filterPriceFrom':
					return 'prijsVan';
				break;
				case 'filterPriceTo':
					return 'prijsTot';
				break;
				default:
					return id;
			}
		}
	};

	return {
		init: init,
		get: get
	};

}) ();
