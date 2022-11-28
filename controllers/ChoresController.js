const fs = require('fs');
const config = require('../config.json');
const { v4: uuid } = require('uuid');
const moment = require('moment');
const { Logger } = require('../logger');
const log = new Logger();

const getChores = async (activity, person) => {
	try {
		if (!fs.existsSync(config.chores.file))
			throw new Error(`Could not find ${config.chores.file}`);
		let chores = JSON.parse(fs.readFileSync(config.chores.file, 'utf-8'));
		chores = chores.sort(function (a, b) {
			return new Date(b.date) - new Date(a.date);
		});
		if (activity) chores = chores.filter((c) => c.activity === activity);
		if (person) chores = chores.filter((c) => c.person === person);
		return chores;
	} catch (err) {
		log.error('Error (getChores):', err);
	}
};

const addChore = async (person, activity) => {
	try {
		if (!person || !activity) throw new Error('Person or activity missing');
		const chores = await getChores();
		const date = new Date();
		const chore = {
			id: uuid(),
			date,
			person,
			activity,
		};
		chores.push(chore);
		fs.writeFileSync(config.chores.file, JSON.stringify(chores));
		await generateChoresLastDone();
		return true;
	} catch (err) {
		log.error('Error (addChore):', err);
		return false;
	}
};

const getNotRecentlyDoneChores = async () => {
	if (!fs.existsSync(config.chores.lastDoneFile)) {
		log.error(`Could not find ${config.chores.lastDoneFile}`);
		return {};
	}
	const chores = JSON.parse(
		fs.readFileSync(config.chores.lastDoneFile, 'utf-8')
	);
	const choreTypes = Object.keys(chores);
	const result = [];
	for (const choreType of choreTypes) {
		const now = moment();
		const choreDate = moment(chores[choreType].date);
		if (
			now.diff(choreDate, 'days') >=
			config.chores.choreAllowedDaysInbetween[choreType]
		)
			result.push({
				activity: choreType,
				date: chores[choreType].date,
				person: chores[choreType].person,
			});
	}
	return result;
};

const generateChoresLastDone = async () => {
	const chores = await getChores();
	const info = {};
	for (const chore of config.chores.choreTypes) {
		const choresOfType = chores
			.filter((c) => c.activity === chore)
			.sort((a, b) => {
				return new Date(b?.date) - new Date(a?.date);
			});

		if (!choresOfType.length) continue;
		info[chore] = {
			date: choresOfType[0]?.date,
			person: choresOfType[0]?.person,
		};
	}
	fs.writeFileSync(config.chores.lastDoneFile, JSON.stringify(info));
};

module.exports = {
	getChores,
	addChore,
	generateChoresLastDone,
	getNotRecentlyDoneChores,
};
