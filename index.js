const express = require('express');
const {
	getHomeDevices,
	toggleDevices,
} = require('./controllers/IkeaHomeController');
const { getNameDay } = require('./controllers/NameDayController');
const { getCarData } = require('./controllers/TeslaController');
const { getWeatherData } = require('./controllers/WeatherController');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/weather', async (_req, res) => {
	res.json(await getWeatherData());
});

app.get('/namedays', async (req, res) => {
	res.json(getNameDay());
});

app.get('/tesla', async (req, res) => {
	res.json(await getCarData());
});

app.get('/home-data', async (req, res) => {
	const values = {
		tesla: await getCarData(),
		weather: await getWeatherData(),
		nameDays: await getNameDay(),
	};
	res.json(values);
});

app.get('/home-devices', async (req, res) => {
	const devices = await getHomeDevices();
	res.json(devices);
});

app.post('/toggle-devices', async (req, res) => {
	const { devices, toggle } = req.body;
	if (!devices || toggle == undefined || !Array.isArray(devices)) {
		res.status(400).json({ error: 'Missing devices or state' });
		return;
	}
	const result = await toggleDevices(devices, toggle);
	res.json({ success: result });
});

app.listen(port, () => {
	console.log(`Home API listening on port ${port}`);
});
