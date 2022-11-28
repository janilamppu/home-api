const tradfri = require('ikea-tradfri');
const config = require('../config.json');
const { Logger } = require('../logger');
const { mapTradfriDevices } = require('../utils');
const { gatewayAddress, credentials, allDevices } = config.tradfri;

const client = new tradfri(gatewayAddress, credentials);
const log = new Logger();

const getHomeDevices = async () => {
	try {
		await client.connect();
		const deviceList = client.device(allDevices);
		return mapTradfriDevices(deviceList);
	} catch (err) {
		log.error('Error (Tradfri):', err);
	}
};

const toggleDevices = async (deviceNames, state) => {
	if (!deviceNames || !deviceNames.length)
		throw new Error('No device names provided');
	try {
		await client.connect();
		const devices = client.device(deviceNames);
		log.info(
			`Setting devices ${deviceNames.join(', ')} to ${state ? 'on' : 'off'}`
		);
		for (const device of devices) {
			await device.switch(state);
		}
		return true;
	} catch (err) {
		log.error('Error (Tradfri):', err);
		return false;
	}
};

module.exports = {
	getHomeDevices,
	toggleDevices,
};
