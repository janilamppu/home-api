# home-api

## Description

JS, Node & Express based REST API to be used with a home dashboard application (used only in a local network)

## Functions

```GET /weather```

Returns present weather conditions in the following format

```
{
    "description": "Pilvistä",
    "icon": "04n",
    "temperature": -4,
    "humidity": 96,
    "windSpeed": "1.9",
    "sunrise": "2022-11-28T06:54:10.000Z",
    "sunset": "2022-11-28T13:13:42.000Z"
}
```

```GET /namedays```

Returns a list of finnish "nimipäivät" on the current date. List of names and their dates: [nimipaivat.json](./nimipaivat.json)

Format:
```
[
  "Heini",
  "Kaisla"
]
```

```GET /tesla```

Queries a local Teslamate API to fetch data from the car (Tesla) such as current state of charge, locking state, charging information, etc.

```
{
  "carName": "Rolling Coal",
  "sentry": false,
  "locked": true,
  "geofence": "Koti",
  "battery_level": 73,
  "charging": true,
  "chargerPower": 3,
  "chargerVoltage": 221,
  "chargerCurrent": 13    
}
```

```GET /home-devices```

Interacts with Ikea Trådfri (smart home) hub which reports state of lighting and smart outlets

```
[
    {
        "id": 65537,
        "isOn": false,
        "alive": true,
        "name": "Olohuoneen valo",
        "type": "Bulb",
        "brightness": 55.1,
        "temperature": 100
    }
]
```

```GET /home-data```

Returns the output of:
- `/tesla`
- `/weather`
- `/namedays`
- List of chores that have not been completed within the defined period (in [config.json](./config.json)). This list is generated in a CRON job which executes daily.

Format:
```
{
    "tesla": {
        "carName": "Tesla Model 3 Performance",
        "sentry": false,
        "locked": true,
        "geofence": "Koti",
        "battery_level": 74,
        "charging": true,
        "chargerPower": 3,
        "chargerVoltage": 222,
        "chargerCurrent": 13
    },
    "weather": {
        "description": "Pilvistä",
        "icon": "04n",
        "temperature": -4,
        "humidity": 96,
        "windSpeed": "1.9",
        "sunrise": "2022-11-28T06:54:10.000Z",
        "sunset": "2022-11-28T13:13:42.000Z"
    },
    "nameDays": [
        "Heini",
        "Kaisla"
    ],
    "choresNotDoneRecently": ["Imurointi"]
}
```

```POST /toggle-devices```

Interacts with Ikea Trådfri to change state of smart lighting and outlets eg. turn a light bulb on or off.

POST payload:
```
{
  "toggle": true,
  "devices": ["Olohuoneen valo"]
}
```

```GET /chores```

Lists performed chores with person and date information.

```
[
    {
        "id": "1a33c5c4-28c0-457a-bed5-f9f5a22f6794",
        "date": "2022-11-25T10:33:44.244Z",
        "person": "Henkilö",
        "activity": "Imurointi"
    }
]
```

```POST /chores```

Adds a performed chore with person and date information.

```
{
    "person": "Henkilö",
    "activity": "Imurointi"
}

```