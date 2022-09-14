const nimipaivat = require('../nimipaivat.json');
const moment = require('moment');

const getNameDay = async () => {
	const date = moment().format('DD.MM');
	return nimipaivat[date] || [];
};

module.exports = {
	getNameDay,
};
