// General functions
var utils = {
	// Makes an API-request
	request: function(url, callback) {
		fetch(url)
			.then(function(response) {
				if (response.status !== 200) {
					console.error('There was an error with status code: ' + response.status);
					return;
				}

				// Examine the text in the response
				response.json().then(function(data) {
					callback(data);
				});
			})
			.catch(function(err) {
				console.error('Fetch Error: ', err);
			});
	},

	// Checks index of value in chosen array
	checkArray: function(value, arr) {
		return arr.indexOf(value);
	},

	// Converts nodelist to array
	convertToArray: function(arr) {
		return Array.prototype.slice.call(arr);
	},

	// Clears an <ul> / <ol>
	clearList: function(list) {
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}
	},

	encrypt: function(string) {

	},

	decrypt: function(string) {

	}
};
