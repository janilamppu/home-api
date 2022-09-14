const tradfri = require('ikea-tradfri');
const config = require('../config.json');
const { mapTradfriDevices } = require('../utils');
const { gatewayAddress, credentials, allDevices } = config.tradfri;

const getHomeDevices = async () => {
	const client = new tradfri(gatewayAddress, credentials);
	try {
		await client.connect();
		const deviceList = client.device(allDevices);
		client.close();
		return mapTradfriDevices(deviceList);
	} catch (err) {
		client.close();
		console.error('Tradfri error:', err);
		return {
			error: err?.message || 'unknown error',
		};
	}
};

const toggleDevices = async (deviceNames, state) => {
	if (!deviceNames || !deviceNames.length)
		throw new Error('No device names provided');
	const client = new tradfri(gatewayAddress, credentials);
	try {
		await client.connect();
		const devices = client.device(deviceNames);
		for (const device of devices) {
			await device.switch(state);
		}
		client.close();
		return true;
	} catch (err) {
		client.close();
		console.error('Tradfri error:', err);
		return false;
	}
};

module.exports = {
	getHomeDevices,
	toggleDevices,
};
