var storage = (function() {
	// Checks if result is already in favorites
	var check = function(id) {
		if (localStorage.favoritesID) {
			return utils.checkArray(id, storage.favorites.id()) != -1;
		}
	};

	// Sets item in favorites
	var set = function(itemType, item) {
		// Toggles item in favorites
		if (item.checked) {
			// Checks if favorites list exists
			if (localStorage.favoritesID) {
				var currentFavType = localStorage.favoritesType;
				var currentFavID = localStorage.favoritesID;

				localStorage.favoritesType = currentFavType + ',' + itemType;
				localStorage.favoritesID = currentFavID + ',' + item.id;
			} else {
				localStorage.favoritesType = itemType;
				localStorage.favoritesID = item.id;
			}
		} else {
			storage.remove(item.id);
		}
	};

	// Removes item from favorites
	var remove = function(id) {
		if (checkArray(id, storage.favorites.id()) != -1) {
			var newTypeStorage = storage.favorites.type();
			var newIDStorage = storage.favorites.id();

			// Removes selected item from localstorage
			newTypeStorage.splice(utils.checkArray(id, storage.favorites.id()), 1);
			newIDStorage.splice(utils.checkArray(id, storage.favorites.type()), 1);

			localStorage.favoritesType = newTypeStorage.join(',');
			localStorage.favoritesID = newIDStorage.join(',');
		}
	};

	// Returns array of favorites string
	var favorites = {
		type: function() {
			return localStorage.favoritesType.split(',');
		},

		id: function() {
			return localStorage.favoritesID.split(',');
		}
	};

	return {
		check: check,
		set: set,
		remove: remove,
		favorites: favorites
	}

}) ();
