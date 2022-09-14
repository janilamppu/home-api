exports.weatherDescriptions = {
	Clouds: 'Pilvistä',
	Mist: 'Sumuista',
	Fog: 'Sumuista',
	Clear: 'Selkeää',
	Thunderstorm: 'Ukkosmyrsky',
	Drizzle: 'Tihkusadetta',
	Rain: 'Sadetta',
	Snow: 'Lumisadetta',
};

exports.mapIkeaDevices = (devices) => {
	return devices.map((device) => {
		switch (device.type) {
			case 'Plug':
				return {
					id: device.id,
					isOn: device.isOn,
					alive: device.alive,
					name: device.name,
					type: device.type,
				};
			case 'Bulb':
				return {
					id: device.id,
					isOn: device.isOn,
					alive: device.alive,
					name: device.name,
					type: device.type,
					brightness: device.brightness,
					temperature: device.temperature,
				};
		}
	});
};
