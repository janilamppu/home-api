const nimipaivat = require('../nimipaivat.json');
const moment = require('moment');

const getNameDay = async () => {
	try {
		const date = moment().format('DD.MM');
		return nimipaivat[date] || [];
	} catch (err) {
		console.error('Error (NameDays):', err);
	}
};

module.exports = {
	getNameDay,
};
