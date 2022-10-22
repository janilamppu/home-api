const fs = require('fs');
const config = require('../config.json');
const { v4: uuid } = require('uuid');

const getChores = async (activityFilter) => {
	try {
		if (!fs.existsSync(config.chores.file))
			throw new Error(`Could not find ${config.chores.file}`);
		let chores = JSON.parse(fs.readFileSync(config.chores.file, 'utf-8'));
		chores = chores.sort(function (a, b) {
			return new Date(b.date) - new Date(a.date);
		});
		if (activityFilter)
			chores = chores.filter((c) => c.activity === activityFilter);
		return chores;
	} catch (err) {
		console.error('Error (getChores):', err);
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
		return true;
	} catch (err) {
		console.error('Error (addChore):', err);
		return false;
	}
};

module.exports = {
	getChores,
	addChore,
};
