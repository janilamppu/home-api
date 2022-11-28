const nimipaivat = require('../nimipaivat.json');
const moment = require('moment');
const { Logger } = require('../logger');
const log = new Logger();

const getNameDay = async () => {
	try {
		const date = moment().format('DD.MM');
		return nimipaivat[date] || [];
	} catch (err) {
		log.error('Error (NameDays):', err);
	}
};

module.exports = {
	getNameDay,
};
