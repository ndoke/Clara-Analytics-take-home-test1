angular.module('firstApplication', [ 'ngMaterial' ]).controller(
		'autoCompleteController', autoCompleteController);

function autoCompleteController($timeout, $q, $log, $scope, $http) {
	var self = this;
	self.simulateQuery = false;
	self.isDisabled = false;
	self.countries = loadCountries();
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;
	self.searchTextChange = searchTextChange;

	function querySearch(query) {
		var results = query ? self.countries.filter(createFilterFor(query))
				: self.countries, deferred;

		if (self.simulateQuery) {
			deferred = $q.defer();

			$timeout(function() {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}

	function searchTextChange(text) {
		$log.info('Text changed to ' + text);
	}

	function selectedItemChange(item) {
		if (self.countries.includes(item)) {
			$log.info('Item changed to ' + item.cities);
			$scope.data = item.cities;
		} else {
			$scope.data = "";
		}
	}

	function loadCountries() {
		var countries;

		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", "CountryFile.json", false);
		rawFile.onreadystatechange = function() {
			if (rawFile.readyState === 4) {
				countries = rawFile.responseText;
			}
		}
		rawFile.send();

		var countryArr = [];
		var jsonCountries = JSON.parse(countries);
		for ( var key in jsonCountries) {
			countryArr.push(key);
		}

		return countryArr.map(function(country) {
			return {
				value : country.toLowerCase(),
				display : country,
				cities : jsonCountries[country]
			};
		});
	}

	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(state) {
			return (state.value.indexOf(lowercaseQuery) === 0);
		};
	}
}
