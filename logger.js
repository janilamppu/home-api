const moment = require('moment');

class Logger {
	info(message, ...params) {
		console.log(
			`[${moment().format('DD.MM.YYYY HH:mm:ss')}]: ${message} ${params || ''}`
		);
	}
	error(message, ...params) {
		console.error(
			`[${moment().format('DD.MM.YYYY HH:mm:ss')}]: ${message} ${params || ''}`
		);
	}
}

module.exports = {
	Logger,
};
