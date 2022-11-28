const express = require('express');
const {
	getChores,
	addChore,
	generateChoresLastDone,
	getNotRecentlyDoneChores,
} = require('./controllers/ChoresController');
const {
	getHomeDevices,
	toggleDevices,
} = require('./controllers/IkeaHomeController');
const { getNameDay } = require('./controllers/NameDayController');
const { getCarData } = require('./controllers/TeslaController');
const { getWeatherData } = require('./controllers/WeatherController');
const app = express();
const port = 3000;
const cron = require('node-cron');
const fs = require('fs');
const config = require('./config.json');
const { Logger } = require('./logger');
const log = new Logger();

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
		choresNotDoneRecently: await getNotRecentlyDoneChores(),
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
	log.info(`Home API listening on port ${port}`);
	if (!fs.existsSync(config.chores.lastDoneFile)) generateChoresLastDone();
});

app.get('/chores', async (req, res) => {
	const { activity, person } = req.query;
	if (activity && !config.chores.choreTypes.includes(activity)) {
		res.status(400).json({ error: 'Invalid activity' });
		return;
	}
	const chores = await getChores(activity, person);
	res.json(chores);
});

app.post('/chores', async (req, res) => {
	const { person, activity } = req.body;
	if (!person || !activity) {
		res.status(400).json({ error: 'Missing person or activity' });
		return;
	}
	if (!config.chores.choreTypes.includes(activity)) {
		res.status(400).json({ error: 'Invalid activity' });
	}
	const response = await addChore(person, activity);
	res.json({ success: response });
});

cron.schedule('0 9 * * *', async () => {
	log.info('Generating chores last done list');
	await generateChoresLastDone();
});
