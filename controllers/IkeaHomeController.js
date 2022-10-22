const tradfri = require('ikea-tradfri');
const config = require('../config.json');
const { mapTradfriDevices } = require('../utils');
const { gatewayAddress, credentials, allDevices } = config.tradfri;

const client = new tradfri(gatewayAddress, credentials);

const getHomeDevices = async () => {
	try {
		await client.connect();
		const deviceList = client.device(allDevices);
		return mapTradfriDevices(deviceList);
	} catch (err) {
		console.error('Error (Tradfri):', err);
	}
};

const toggleDevices = async (deviceNames, state) => {
	if (!deviceNames || !deviceNames.length)
		throw new Error('No device names provided');
	try {
		await client.connect();
		const devices = client.device(deviceNames);
		for (const device of devices) {
			await device.switch(state);
		}
		return true;
	} catch (err) {
		console.error('Error (Tradfri):', err);
		return false;
	}
};

module.exports = {
	getHomeDevices,
	toggleDevices,
};
