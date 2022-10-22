const axios = require('axios');
const moment = require('moment');
const { weatherDescriptions } = require('../utils');
const config = require('../config.json');

exports.getWeatherData = async function () {
	try {
		const requestParams = {
			q: `${config.weather.city},FI`,
			appid: config.weather.appId,
			units: config.weather.units,
		};
		let url = addQueryParamsToUrl(config.weather.apiUrl, requestParams);
		let response = await axios.get(url);
		return formResponse(response.data);
	} catch (err) {
		console.error('Error (WeatherAPI):', err);
	}
};

const formResponse = (rawResponse) => {
	return {
		description: getWeatherDescription(rawResponse.weather[0].main),
		icon: rawResponse.weather[0].icon,
		temperature: Math.round(rawResponse.main.temp),
		humidity: rawResponse.main.humidity,
		windSpeed: rawResponse.wind.speed.toFixed(1),
		sunrise: moment.unix(rawResponse.sys.sunrise).toISOString(),
		sunset: moment.unix(rawResponse.sys.sunset).toISOString(),
	};
};

const getWeatherDescription = (desc) => {
	if (!weatherDescriptions[desc]) {
		console.log(`${desc} is missing from weather translations!`);
		return 'Ei tiedossa';
	} else {
		return weatherDescriptions[desc];
	}
};

const addQueryParamsToUrl = (url, params) => {
	Object.keys(params).forEach((param, index) => {
		url += (index == 0 ? '?' : '&') + param + '=' + params[param];
	});
	return url;
};
