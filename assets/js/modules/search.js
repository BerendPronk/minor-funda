var search = (function() {
	var init = function() {
		form.search.addEventListener('input', get.suggestions);
		form.suggestions.classList.add('hidden');
		form.submit.addEventListener('click', get.results);
	};

	var form = {
		search: document.querySelector('header form [type="text"]'),
		suggestions: document.querySelector('header form #suggestions'),
		submit: document.querySelector('header form #submit')
	};

	// Set selected suggestion and removes suggestion list
	var set = function(value) {
		form.search.value = value;

		utils.clearList(form.suggestions);
		form.suggestions.classList.add('hidden');
	};

	var get = {
		// JSONP request for suggestion on current input
		suggestions: function() {
			utils.JSONP.send('http://zb.funda.info/frontend/geo/suggest/?query=/' + this.value + '/&max=5&type=koop&callback=callback', {
				onSuccess: function(data){
					var results = data.Results;

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
						var suggestionBox = document.createElement('ul');
						var location = document.createElement('li');
						var amount = document.createElement('li');

						location.textContent = result.Display.Naam;
						location.insertAdjacentHTML('beforeend', '<span>' + result.Display.NiveauLabel + '</span>');

						amount.textContent = result.Aantal;
						amount.insertAdjacentHTML('beforeend', '<img src="./assets/img/house.png" alt="huizen">');

						suggestionBox.appendChild(location);
						suggestionBox.appendChild(amount);

						suggestion.appendChild(suggestionBox);
						suggestion.addEventListener('click', function() {
							set(result.Display.Naam);
							get.results();
						});

						form.suggestions.appendChild(suggestion);
						form.suggestions.classList.remove('hidden');
					});

				},
				onTimeout: function(){
					console.warn('Search suggestions has timed out!');
				},
				timeout: 5000
			});
		},

		// Fetch promise requesting input from API
		results: function(event) {
			if (form.search.value === '') {
				return false;
			}

			utils.request('http://funda.kyrandia.nl/feeds/Aanbod.svc/json/' + config.apiKey + '/?type=koop&zo=/' + form.search.value + '/&page=' + 1 + '&pagesize=' + 25,
				function(data) {
					var results = data.Objects;

					if (results.length === 0) {
						utils.feedback('Geen resultaten', 'negative');
						return false;
					} else if (results.length === 1) {
						utils.feedback('1 resultaat', 'positive');
					} else {
						utils.feedback(results.length + ' resultaten', 'positive');
					}

					results.map(function(result) {
						var houseList = document.querySelector('#results');
						var house = document.createElement('li');

						house.textContent = result.Adres;

						// rename house?

						// expand (design)!

						console.log(result);

						houseList.appendChild(house);


						// maybe sidescroller? three fixed pages
						router.navigate('two');
					});
				});
		}
	};

	var filter = {
		// var results = data.Objects;

		// console.log(results);

		// var filtered = results.filter(function(object) {
		// 	return object.AantalKamers === 4;
		// });
	};

	return {
		init: init
	};

}) ();
