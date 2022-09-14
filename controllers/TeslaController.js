const axios = require('axios');
const config = require('../config.json');

const getCarData = async () => {
	const response = await axios.get(config.tesla.apiUrl).catch(() => {
		return {
			error: 'Could not fetch data',
		};
	});
	const carData = response.data;
	const { sentry_mode, locked } = carData.data.status.car_status;
	const { geofence } = carData.data.status.car_geodata;
	const { battery_level } = carData.data.status.battery_details;
	const { charger_power, charger_voltage, charger_actual_current } =
		carData.data.status.charging_details;
	const carName = carData.data.car.car_name;
	const charging =
		carData.data.status.charging_details.plugged_in &&
		carData.data.status.charging_details.charger_power > 0;
	return {
		carName,
		sentry: sentry_mode,
		locked,
		geofence,
		battery_level,
		charging,
		chargerPower: charger_power,
		chargerVoltage: charger_voltage,
		chargerCurrent: charger_actual_current,
	};
};

module.exports = {
	getCarData,
};
